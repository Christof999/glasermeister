import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Maße in mm aus den Originalzeichnungen (P. Stettner):
 * – „Duschtüre schulstr.": 753 × 1455, Eckschräge oben links (569/1242),
 *   zwei Bandaussparungen an der Schlagkante.
 * – „Seitenteil Dusche": 705 × 1158, fünf Winkel entlang Dachschräge & Sitzbank.
 */
const MM = 1 / 1000;

function doorShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(753, 0);
  // Schlagkante mit Bandaussparungen (52 tief, 84 hoch)
  s.lineTo(753, 237);
  s.lineTo(701, 237);
  s.lineTo(701, 321);
  s.lineTo(753, 321);
  s.lineTo(753, 1121);
  s.lineTo(701, 1121);
  s.lineTo(701, 1205);
  s.lineTo(753, 1205);
  s.lineTo(753, 1455);
  // Oberkante & Eckschräge (Dachbalken)
  s.lineTo(184, 1455);
  s.lineTo(0, 1242);
  s.closePath();
  return s;
}

function panelShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(436, 0);
  s.lineTo(705, 0);
  s.lineTo(705, 1158);
  s.lineTo(519, 1158);
  s.lineTo(0, 554); // Dachschräge, 796 mm
  s.lineTo(15, 363);
  s.lineTo(436, 330); // über der Sitzbank
  s.closePath();
  return s;
}

function paneGeometry(shape: THREE.Shape, thicknessMm: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thicknessMm,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 1.2,
    bevelSegments: 2,
  });
  geo.scale(MM, MM, MM);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  // Zentrieren auf x, Unterkante auf y = 0
  geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
  return geo;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const window01 = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));

type PaneSpec = {
  geometry: THREE.ExtrudeGeometry;
  from: { pos: THREE.Vector3; rot: THREE.Euler };
  to: { pos: THREE.Vector3; rot: THREE.Euler };
  range: [number, number];
};

function Panes({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { gl, scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Prozedurale Studio-Umgebung für Glanz & Reflexionen – keine externen Assets
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#3d4644'), // Parsol grau, getönt
        metalness: 0,
        roughness: 0.04,
        transparent: true,
        opacity: 0.38,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 0.65,
        side: THREE.DoubleSide,
      }),
    []
  );

  const panes = useMemo<PaneSpec[]>(
    () => [
      {
        // Duschtüre – fliegt von rechts ein, stellt sich frontal
        geometry: paneGeometry(doorShape(), 8),
        from: {
          pos: new THREE.Vector3(3.4, 1.6, -2.6),
          rot: new THREE.Euler(0.7, -1.5, 0.55),
        },
        to: {
          pos: new THREE.Vector3(0.34, 0, 0),
          rot: new THREE.Euler(0, 0, 0),
        },
        range: [0.08, 0.6],
      },
      {
        // Seitenteil – von links, dreht sich in den 90°-Anschluss
        geometry: paneGeometry(panelShape(), 10),
        from: {
          pos: new THREE.Vector3(-3.6, 2.0, -2.2),
          rot: new THREE.Euler(-0.9, 1.4, -0.6),
        },
        to: {
          pos: new THREE.Vector3(-0.42, 0.15, 0.36),
          rot: new THREE.Euler(0, Math.PI / 2.6, 0),
        },
        range: [0.34, 0.88],
      },
    ],
    []
  );

  useEffect(
    () => () => {
      panes.forEach((p) => p.geometry.dispose());
      material.dispose();
    },
    [panes, material]
  );

  useFrame(({ pointer }) => {
    const p = progressRef.current;
    const refs = [doorRef.current, panelRef.current];
    panes.forEach((spec, i) => {
      const mesh = refs[i];
      if (!mesh) return;
      const t = easeOutCubic(window01(p, spec.range[0], spec.range[1]));
      mesh.position.lerpVectors(spec.from.pos, spec.to.pos, t);
      mesh.rotation.set(
        THREE.MathUtils.lerp(spec.from.rot.x, spec.to.rot.x, t),
        THREE.MathUtils.lerp(spec.from.rot.y, spec.to.rot.y, t),
        THREE.MathUtils.lerp(spec.from.rot.z, spec.to.rot.z, t)
      );
      // Leichtes Schweben, bis die Scheibe „einrastet"
      const hover = (1 - t) * 0.04;
      mesh.position.y += Math.sin(performance.now() / 600 + i * 2) * hover;
    });
    if (groupRef.current) {
      // Dezente Parallaxe zur Mausposition
      groupRef.current.rotation.y +=
        (pointer.x * 0.12 - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.x +=
        (-pointer.y * 0.05 - groupRef.current.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.62, 0]} scale={0.88}>
      <mesh ref={doorRef} geometry={panes[0].geometry} material={material} />
      <mesh ref={panelRef} geometry={panes[1].geometry} material={material} />
    </group>
  );
}

export function GlassScene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 32, position: [0, 0.18, 3.4], near: 0.1, far: 20 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 4, 3]} intensity={0.7} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#7FB3B3" />
      <Panes progressRef={progressRef} />
    </Canvas>
  );
}
