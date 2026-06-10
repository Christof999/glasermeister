import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react';
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

const CAM_Y = 0.18;
const CAM_Z = 3.4;
const CAM_FOV = 32;

type PaneSpec = {
  geometry: THREE.ExtrudeGeometry;
  from: { pos: THREE.Vector3; rot: THREE.Euler };
  to: { pos: THREE.Vector3; rot: THREE.Euler };
  range: [number, number];
};

/**
 * Endpositionen relativ zum Foto-Rahmen der Story berechnen, damit die
 * Scheiben exakt „in" der Duschnische landen – unabhängig von der
 * Viewport-Größe. Der Rahmen wird direkt im DOM vermessen (offset-Werte,
 * unbeeinflusst von Transforms); fällt nur ohne Element auf eine
 * Näherung der CSS-Regeln zurück.
 */
function frameLayout(vw: number, vh: number, frameEl: HTMLElement | null) {
  let frameW: number;
  let frameH: number;
  let frameCxPx = 0; // Rahmenmitte relativ zur Bildschirmmitte
  let frameBottomPx: number; // Unterkante relativ zur Bildschirmmitte

  if (frameEl) {
    frameW = frameEl.offsetWidth;
    frameH = frameEl.offsetHeight;
    frameCxPx = frameEl.offsetLeft + frameW / 2 - vw / 2;
    frameBottomPx = frameEl.offsetTop + frameH - vh / 2;
  } else {
    const gutter = Math.min(Math.max(16, vw * 0.04), 32);
    const capH = vw <= 720 ? 0.62 * vh : 0.8 * vh;
    frameH = Math.min(capH, (vw - 2 * gutter) / 0.75);
    frameW = frameH * 0.75;
    frameBottomPx = frameH / 2;
  }

  // Weltkoordinaten pro Pixel in der z=0-Ebene
  const wpp = (2 * CAM_Z * Math.tan(((CAM_FOV / 2) * Math.PI) / 180)) / vh;

  // Türblatt: rechte Hälfte der Nische, Unterkante knapp über Rahmenunterkante
  const paneScale = (frameH * 0.62 * wpp) / 1.455;
  const bottomY = CAM_Y - frameBottomPx * wpp + frameH * 0.03 * wpp;
  const doorX = (frameCxPx + frameW * 0.17) * wpp;
  // Seitenteil: links davor, im 90°-Anschluss zur Tür
  const panelX = (frameCxPx - frameW * 0.21) * wpp;
  const panelZ = 0.705 * paneScale * 0.42;
  // Gleiche Bodenlinie im Bild trotz Kameranähe (Strahlensatz)
  const panelY = CAM_Y - ((CAM_Y - bottomY) * (CAM_Z - panelZ)) / CAM_Z;

  return { paneScale, bottomY, doorX, panelX, panelY, panelZ };
}

type PanesProps = {
  progressRef: MutableRefObject<number>;
  frameRef?: RefObject<HTMLElement | null>;
};

function Panes({ progressRef, frameRef }: PanesProps) {
  const { gl, scene, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  const layout = useMemo(
    () => frameLayout(size.width, size.height, frameRef?.current ?? null),
    [size.width, size.height, frameRef]
  );

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
        // Duschtüre – fliegt von rechts ein, stellt sich frontal in die Nische
        geometry: paneGeometry(doorShape(), 8),
        from: {
          pos: new THREE.Vector3(3.4, 1.6, -2.6),
          rot: new THREE.Euler(0.7, -1.5, 0.55),
        },
        to: {
          pos: new THREE.Vector3(layout.doorX, layout.bottomY, 0),
          rot: new THREE.Euler(0, 0, 0),
        },
        range: [0.08, 0.6],
      },
      {
        // Seitenteil – von links, dreht sich in den 90°-Anschluss davor
        geometry: paneGeometry(panelShape(), 10),
        from: {
          pos: new THREE.Vector3(-3.6, 2.0, -2.2),
          rot: new THREE.Euler(-0.9, 1.4, -0.6),
        },
        to: {
          pos: new THREE.Vector3(layout.panelX, layout.panelY, layout.panelZ),
          rot: new THREE.Euler(0, Math.PI / 2.45, 0),
        },
        range: [0.34, 0.88],
      },
    ],
    [layout]
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
      mesh.scale.setScalar(layout.paneScale);
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
      // Sehr dezente Parallaxe zur Mausposition – darf die Endposition
      // im Foto-Rahmen nur minimal verschieben
      groupRef.current.rotation.y +=
        (pointer.x * 0.045 - groupRef.current.rotation.y) * 0.06;
      groupRef.current.rotation.x +=
        (-pointer.y * 0.02 - groupRef.current.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={doorRef} geometry={panes[0].geometry} material={material} />
      <mesh ref={panelRef} geometry={panes[1].geometry} material={material} />
    </group>
  );
}

export function GlassScene({ progressRef, frameRef }: PanesProps) {
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
      <Panes progressRef={progressRef} frameRef={frameRef} />
    </Canvas>
  );
}
