import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { projects, type Project } from '../../data/projects';
import { toWebp } from '../../lib/img';
import type { LookState } from './lookState';

/**
 * Begehbare Projekt-Sphäre: Die Kamera steht im Mittelpunkt einer Kugel,
 * die Projekte liegen als gewölbte Segmente auf deren Innenseite – wie die
 * Kachelwand auf phantom.land. Maus bewegen (Desktop) bzw. Wischen (Touch)
 * dreht den Blick, ein hohes Sichtfeld sorgt für den Fisheye-Eindruck.
 */

const RADIUS = 10;
const FOV = 96;

/** Kachelmaße im Bogenmaß, abgeleitet von der Layout-Größe des Projekts */
const TILE_SIZE: Record<Project['size'], { phi: number; theta: number }> = {
  lg: { phi: 0.8, theta: 0.74 },
  md: { phi: 0.68, theta: 0.62 },
  sm: { phi: 0.58, theta: 0.52 },
};

type TileSpec = {
  key: string;
  project: Project;
  radius: number;
  phiStart: number;
  phiLen: number;
  thetaStart: number;
  thetaLen: number;
  thetaCenter: number;
  roll: number;
  axis: [number, number, number];
};

/** Kleiner deterministischer Zufallsgenerator – gleiche Sphäre bei jedem
 *  Laden, aber genug „Unordnung“ für einen lebendigen Raum. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jedes Projekt genau einmal – über die ganze Innenseite verstreut statt
 *  in einem ordentlichen Äquator-Ring. Grundabstand im Azimut sorgt dafür,
 *  dass in jeder Blickrichtung etwas liegt; Jitter, Höhenstreuung, eine
 *  Eigendrehung je Kachel und wechselnde Abstände nehmen den „gebügelten“
 *  Eindruck und geben Tiefe beim Umsehen. */
function buildTiles(): TileSpec[] {
  const n = projects.length;
  const step = (Math.PI * 2) / n;
  const rand = mulberry32(0x5eed42);
  return projects.map((project, i) => {
    const size = TILE_SIZE[project.size];
    // Azimut: gleichmäßige Grundverteilung + kräftiger Jitter
    const phiCenter = i * step + (rand() - 0.5) * step * 1.15;
    // Höhe: weit über den Äquator gestreut (statt enger Zickzack-Reihe)
    const thetaCenter = Math.PI / 2 + (rand() * 2 - 1) * 0.82;
    // Eigendrehung der Kachel um ihre Blickachse
    const roll = (rand() * 2 - 1) * 0.27;
    // Abstand variieren → Parallaxe/Tiefe beim Umsehen
    const radius = RADIUS * (0.82 + rand() * 0.36);
    // Radiale Achse durch den Kachelmittelpunkt (three.js-SphereGeometry-Konvention)
    const axis: [number, number, number] = [
      -Math.cos(phiCenter) * Math.sin(thetaCenter),
      Math.cos(thetaCenter),
      Math.sin(phiCenter) * Math.sin(thetaCenter),
    ];
    return {
      key: project.id,
      project,
      radius,
      phiStart: phiCenter - size.phi / 2,
      phiLen: size.phi,
      thetaStart: thetaCenter - size.theta / 2,
      thetaLen: size.theta,
      thetaCenter,
      roll,
      axis,
    };
  });
}

/** Textur mittig zuschneiden, damit das Foto die Kachel ohne Verzerrung füllt. */
function coverTexture(base: THREE.Texture, tileAspect: number): THREE.Texture {
  const t = base.clone();
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  const img = base.image as { width?: number; height?: number } | undefined;
  const imgAspect = img && img.width && img.height ? img.width / img.height : 1;
  if (imgAspect > tileAspect) {
    const r = tileAspect / imgAspect;
    t.repeat.set(r, 1);
    t.offset.set((1 - r) / 2, 0);
  } else {
    const r = imgAspect / tileAspect;
    t.repeat.set(1, r);
    t.offset.set(0, (1 - r) / 2);
  }
  t.needsUpdate = true;
  return t;
}

function Tile({
  spec,
  texture,
  onHover,
}: {
  spec: TileSpec;
  texture: THREE.Texture;
  onHover: (p: Project | null) => void;
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const hovered = useRef(false);

  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(
      spec.radius,
      24,
      18,
      spec.phiStart,
      spec.phiLen,
      spec.thetaStart,
      spec.thetaLen
    );
    // Von innen betrachtet wären die Fotos spiegelverkehrt – UVs horizontal kippen
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    return g;
  }, [spec.radius, spec.phiStart, spec.phiLen, spec.thetaStart, spec.thetaLen]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Eigendrehung der Kachel um ihre eigene Blickachse: dreht den gewölbten
  // Ausschnitt an Ort und Stelle (alle Vertices behalten ihren Radius),
  // sodass die Fotos schräg statt schnurgerade im Raum hängen.
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(spec.axis[0], spec.axis[1], spec.axis[2]).normalize(),
        spec.roll
      ),
    [spec.axis, spec.roll]
  );

  useFrame((_, dt) => {
    if (!material.current) return;
    const target = hovered.current ? 1 : 0.72;
    const c = material.current.color;
    const k = 1 - Math.exp(-dt * 9);
    c.setScalar(c.r + (target - c.r) * k);
  });

  // Die Auswahl (Tap/Klick) wertet der umgebende Raum über den
  // Hover-Zustand aus – das ist robuster als der Klick-Raycast.
  return (
    <mesh
      geometry={geometry}
      quaternion={quaternion}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hovered.current = true;
        onHover(spec.project);
      }}
      onPointerOut={() => {
        hovered.current = false;
        onHover(null);
      }}
    >
      <meshBasicMaterial
        ref={material}
        map={texture}
        side={THREE.BackSide}
        color="#b8b8b8"
        toneMapped={false}
      />
    </mesh>
  );
}

function Tiles({ onHover }: { onHover: (p: Project | null) => void }) {
  const tiles = useMemo(buildTiles, []);
  const covers = useMemo(() => projects.map((p) => p.cover), []);
  // Texturen als WebP laden (deutlich kleiner), aber weiterhin über den
  // Originalpfad referenzieren – jeder WebGL-fähige Browser kann WebP.
  const sources = useMemo(() => covers.map(toWebp), [covers]);
  const baseTextures = useLoader(THREE.TextureLoader, sources);

  const textures = useMemo(() => {
    const byCover = new Map(covers.map((c, i) => [c, baseTextures[i]]));
    return tiles.map((tile) => {
      const tileAspect = (tile.phiLen * Math.sin(tile.thetaCenter)) / tile.thetaLen;
      return coverTexture(byCover.get(tile.project.cover)!, tileAspect);
    });
  }, [tiles, covers, baseTextures]);

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <>
      {tiles.map((tile, i) => (
        <Tile key={tile.key} spec={tile} texture={textures[i]} onHover={onHover} />
      ))}
    </>
  );
}

/** Glättet Blickrichtung aus Mausposition, Drag-Versatz und leichter Eigendrehung. */
function Rig({ look, paused }: { look: React.MutableRefObject<LookState>; paused: boolean }) {
  useFrame((state, dt) => {
    if (paused) return; // Modal offen: Hintergrund komplett einfrieren
    const l = look.current;
    // Eigendrehung stoppen, solange eine Kachel anvisiert wird –
    // sonst wandert das Ziel zwischen Drücken und Loslassen weg
    if (!l.hold) l.drift += dt * 0.018;
    const targetYaw = l.mouseYaw + l.dragYaw + l.drift;
    const targetPitch = THREE.MathUtils.clamp(l.mousePitch + l.dragPitch, -0.85, 0.85);
    const k = 1 - Math.exp(-dt * 3.4);
    l.yaw += (targetYaw - l.yaw) * k;
    l.pitch += (targetPitch - l.pitch) * k;
    state.camera.rotation.set(l.pitch, l.yaw, 0, 'YXZ');
    // Hover bei jedem Frame neu auswerten: Die Kamera bewegt sich auch
    // unter einem ruhenden Zeiger, sonst veraltet der anvisierte Treffer.
    state.events.update?.();
  });
  return null;
}

export function SphereScene({
  look,
  paused,
  onHover,
}: {
  look: React.MutableRefObject<LookState>;
  paused: boolean;
  onHover: (p: Project | null) => void;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0, 0] }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#040404']} />
      <Rig look={look} paused={paused} />
      <Suspense fallback={null}>
        <Tiles onHover={onHover} />
      </Suspense>
    </Canvas>
  );
}
