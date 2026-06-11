import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { projects, type Project } from '../../data/projects';
import type { LookState } from './lookState';

/**
 * Begehbare Projekt-Sphäre: Die Kamera steht im Mittelpunkt einer Kugel,
 * die Projekte liegen als gewölbte Segmente auf deren Innenseite – wie die
 * Kachelwand auf phantom.land. Maus bewegen (Desktop) bzw. Wischen (Touch)
 * dreht den Blick, ein hohes Sichtfeld sorgt für den Fisheye-Eindruck.
 */

const RADIUS = 10;
const COLS = 7;
const ROW_OFFSETS = [-0.72, 0, 0.72]; // Polarwinkel-Versatz der drei Ringe
const TILE_PHI = 0.62; // Kachelbreite im Bogenmaß
const TILE_THETA = 0.58; // Kachelhöhe im Bogenmaß
const FOV = 96;

type TileSpec = {
  key: string;
  project: Project;
  phiStart: number;
  thetaStart: number;
  thetaCenter: number;
};

function buildTiles(): TileSpec[] {
  const tiles: TileSpec[] = [];
  const step = (Math.PI * 2) / COLS;
  ROW_OFFSETS.forEach((offset, row) => {
    const thetaCenter = Math.PI / 2 + offset;
    for (let col = 0; col < COLS; col++) {
      // Reihen versetzt starten, damit nicht dreimal dieselbe Spalte entsteht
      const project = projects[(row * 3 + col) % projects.length];
      tiles.push({
        key: `${row}-${col}`,
        project,
        phiStart: col * step + (row % 2) * (step / 2) - TILE_PHI / 2,
        thetaStart: thetaCenter - TILE_THETA / 2,
        thetaCenter,
      });
    }
  });
  return tiles;
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
  onSelect,
  onHover,
}: {
  spec: TileSpec;
  texture: THREE.Texture;
  onSelect: (p: Project) => void;
  onHover: (p: Project | null) => void;
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const hovered = useRef(false);

  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(
      RADIUS,
      24,
      18,
      spec.phiStart,
      TILE_PHI,
      spec.thetaStart,
      TILE_THETA
    );
    // Von innen betrachtet wären die Fotos spiegelverkehrt – UVs horizontal kippen
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    return g;
  }, [spec.phiStart, spec.thetaStart]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    if (!material.current) return;
    const target = hovered.current ? 1 : 0.72;
    const c = material.current.color;
    const k = 1 - Math.exp(-dt * 9);
    c.setScalar(c.r + (target - c.r) * k);
  });

  return (
    <mesh
      geometry={geometry}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.delta < 12) onSelect(spec.project);
      }}
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

function Tiles({
  onSelect,
  onHover,
}: {
  onSelect: (p: Project) => void;
  onHover: (p: Project | null) => void;
}) {
  const tiles = useMemo(buildTiles, []);
  const covers = useMemo(() => projects.map((p) => p.cover), []);
  const baseTextures = useLoader(THREE.TextureLoader, covers);

  const textures = useMemo(() => {
    const byCover = new Map(covers.map((c, i) => [c, baseTextures[i]]));
    return tiles.map((tile) => {
      const tileAspect =
        (TILE_PHI * Math.sin(tile.thetaCenter)) / TILE_THETA;
      return coverTexture(byCover.get(tile.project.cover)!, tileAspect);
    });
  }, [tiles, covers, baseTextures]);

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <>
      {tiles.map((tile, i) => (
        <Tile key={tile.key} spec={tile} texture={textures[i]} onSelect={onSelect} onHover={onHover} />
      ))}
    </>
  );
}

/** Glättet Blickrichtung aus Mausposition, Drag-Versatz und leichter Eigendrehung. */
function Rig({ look, paused }: { look: React.MutableRefObject<LookState>; paused: boolean }) {
  useFrame((state, dt) => {
    const l = look.current;
    if (!paused) l.drift += dt * 0.018;
    const targetYaw = l.mouseYaw + l.dragYaw + l.drift;
    const targetPitch = THREE.MathUtils.clamp(l.mousePitch + l.dragPitch, -0.6, 0.6);
    const k = 1 - Math.exp(-dt * 3.4);
    l.yaw += (targetYaw - l.yaw) * k;
    l.pitch += (targetPitch - l.pitch) * k;
    state.camera.rotation.set(l.pitch, l.yaw, 0, 'YXZ');
  });
  return null;
}

export function SphereScene({
  look,
  paused,
  onSelect,
  onHover,
}: {
  look: React.MutableRefObject<LookState>;
  paused: boolean;
  onSelect: (p: Project) => void;
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
        <Tiles onSelect={onSelect} onHover={onHover} />
      </Suspense>
    </Canvas>
  );
}
