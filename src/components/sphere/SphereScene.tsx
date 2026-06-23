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
  phiStart: number;
  phiLen: number;
  thetaStart: number;
  thetaLen: number;
  thetaCenter: number;
};

/** Jedes Projekt genau einmal: ein Ring um den Äquator, abwechselnd
 * nach oben/unten versetzt, damit es nach Raum statt Karussell aussieht. */
function buildTiles(): TileSpec[] {
  const step = (Math.PI * 2) / projects.length;
  return projects.map((project, i) => {
    const size = TILE_SIZE[project.size];
    const wobble = (((i * 37) % 5) - 2) * 0.045;
    const thetaCenter = Math.PI / 2 + (i % 2 === 0 ? -0.36 : 0.38) + wobble;
    return {
      key: project.id,
      project,
      phiStart: i * step - size.phi / 2,
      phiLen: size.phi,
      thetaStart: thetaCenter - size.theta / 2,
      thetaLen: size.theta,
      thetaCenter,
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
      RADIUS,
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
  }, [spec.phiStart, spec.phiLen, spec.thetaStart, spec.thetaLen]);

  useEffect(() => () => geometry.dispose(), [geometry]);

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
    const targetPitch = THREE.MathUtils.clamp(l.mousePitch + l.dragPitch, -0.6, 0.6);
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
