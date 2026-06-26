import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { projects, type Project } from '../../data/projects';
import { toWebp } from '../../lib/img';
import type { LookState } from './lookState';

/**
 * Projekte als konkave Panorama-Wand: ein ordentliches Raster (Reihen ×
 * Spalten) liegt auf einer gewölbten Zylinderfläche, deren Achse vor dem
 * Betrachter sitzt. Dadurch ist die Mitte weiter weg, während die linken und
 * rechten Ränder näher und größer auf den Betrachter zukommen – ein Halbkreis,
 * der einen umfasst. Maus/Wischen schwenkt den Blick über die Wand.
 */

const FOV = 74;
const ARC_R = 9.5; // Radius der Wölbung
const ARC_FRONT = 5.5; // Zylinderachse vor dem Betrachter → Mitte fern, Ränder nah
const H_HALF = 1.18; // halbe Rasterbreite (Bogenmaß)
const FILL = 0.9; // Kachel füllt 90 % ihrer Zelle → schmale, gleichmäßige Fugen
const ROW_RATIO = 1.12; // Kachelhöhe relativ zur Breite

type TileSpec = {
  key: string;
  project: Project;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  width: number;
  height: number;
};

/** Raster aufbauen und auf die gewölbte Wand legen. Jede Zeile wird zentriert,
 *  jede Kachel schaut den Betrachter (Ursprung) an. */
function buildGrid(): TileSpec[] {
  const n = projects.length;
  const rows = Math.max(1, Math.round(Math.sqrt(n / 2))); // 18 → 3 Reihen
  const cols = Math.ceil(n / rows); // → 6 Spalten
  const colStep = (2 * H_HALF) / cols;
  const width = ARC_R * colStep * FILL;
  const height = width * ROW_RATIO;
  const rowGap = height / FILL; // gleicher Fugenanteil senkrecht wie waagrecht
  const orient = new THREE.Object3D();

  return projects.map((project, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const inRow = Math.min(cols, n - row * cols); // letzte Reihe ggf. kürzer → zentrieren
    const aH = (col - (inRow - 1) / 2) * colStep;

    // Punkt auf der Zylinderwand (Achse ARC_FRONT vor dem Betrachter)
    const x = ARC_R * Math.sin(aH);
    const z = -(ARC_FRONT + ARC_R * Math.cos(aH));
    const y = ((rows - 1) / 2 - row) * rowGap;

    // Kachel zum Betrachter ausrichten. Für Nicht-Kamera-Objekte zeigt
    // lookAt(0,0,0) die Vorderseite (+Z) zum Ursprung – also zur Kamera.
    orient.position.set(x, y, z);
    orient.lookAt(0, 0, 0);
    const q = orient.quaternion;

    return {
      key: project.id,
      project,
      position: [x, y, z],
      quaternion: [q.x, q.y, q.z, q.w],
      width,
      height,
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

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(spec.width, spec.height),
    [spec.width, spec.height]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    if (!material.current) return;
    const target = hovered.current ? 1 : 0.74;
    const c = material.current.color;
    const k = 1 - Math.exp(-dt * 9);
    c.setScalar(c.r + (target - c.r) * k);
  });

  return (
    <mesh
      geometry={geometry}
      position={spec.position}
      quaternion={spec.quaternion}
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
      <meshBasicMaterial ref={material} map={texture} color="#bdbdbd" toneMapped={false} />
    </mesh>
  );
}

function Tiles({ onHover }: { onHover: (p: Project | null) => void }) {
  const tiles = useMemo(buildGrid, []);
  const covers = useMemo(() => projects.map((p) => p.cover), []);
  // Texturen als WebP laden (deutlich kleiner), aber weiterhin über den
  // Originalpfad referenzieren – jeder WebGL-fähige Browser kann WebP.
  const sources = useMemo(() => covers.map(toWebp), [covers]);
  const baseTextures = useLoader(THREE.TextureLoader, sources);

  const textures = useMemo(() => {
    const byCover = new Map(covers.map((c, i) => [c, baseTextures[i]]));
    return tiles.map((tile) =>
      coverTexture(byCover.get(tile.project.cover)!, tile.width / tile.height)
    );
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

/** Glättet die Blickrichtung aus Mausposition und Drag-Versatz. Geschwenkt
 *  wird über die Wand – begrenzt, damit man nicht ins Leere dreht. */
function Rig({ look, paused }: { look: React.MutableRefObject<LookState>; paused: boolean }) {
  useFrame((state, dt) => {
    if (paused) return; // Modal offen: Hintergrund komplett einfrieren
    const l = look.current;
    const targetYaw = THREE.MathUtils.clamp(l.mouseYaw + l.dragYaw, -0.82, 0.82);
    const targetPitch = THREE.MathUtils.clamp(l.mousePitch + l.dragPitch, -0.42, 0.42);
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
