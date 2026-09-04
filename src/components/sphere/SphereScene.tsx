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

const FOV = 60; // engeres Sichtfeld → Projekte rücken näher/größer heran
const ARC_R = 9.5; // Radius der Wölbung
const ARC_FRONT = 5.5; // Zylinderachse vor dem Betrachter → Mitte fern, Ränder nah
const H_HALF = 1.18; // halbe Rasterbreite (Bogenmaß)
const FILL = 0.93; // Kachel füllt 93 % ihrer Zelle → schmale, gleichmäßige Fugen
const ROW_RATIO = 4 / 3; // Zellhöhe relativ zur Breite – entspricht dem Hochformat der Fotos

/** Rasterzelle auf der gewölbten Wand. Die Kachel selbst wird später in diese
 *  Zelle eingepasst – im Seitenverhältnis des jeweiligen Fotos. */
type CellSpec = {
  key: string;
  project: Project;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  cellWidth: number;
  cellHeight: number;
};

type TileSpec = CellSpec & {
  width: number;
  height: number;
};

/** Raster aufbauen und auf die gewölbte Wand legen. Jede Zeile wird zentriert,
 *  jede Kachel schaut den Betrachter (Ursprung) an. */
function buildGrid(): CellSpec[] {
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
      cellWidth: width,
      cellHeight: height,
    };
  });
}

/** Bild vollständig in seine Rasterzelle einpassen (contain). Früher wurde die
 *  Textur mittig auf das Zellformat beschnitten – bei den überwiegend hochkant
 *  aufgenommenen Fotos war davon nur noch ein Ausschnitt zu sehen. Jetzt bekommt
 *  jede Kachel das Seitenverhältnis ihres Fotos, das Bild bleibt vollständig. */
function fitToCell(cell: CellSpec, texture: THREE.Texture): TileSpec {
  const img = texture.image as { width?: number; height?: number } | undefined;
  const cellAspect = cell.cellWidth / cell.cellHeight;
  const imgAspect = img && img.width && img.height ? img.width / img.height : cellAspect;
  const width = imgAspect > cellAspect ? cell.cellWidth : cell.cellHeight * imgAspect;
  const height = imgAspect > cellAspect ? cell.cellWidth / imgAspect : cell.cellHeight;
  return { ...cell, width, height };
}

function Tile({
  spec,
  texture,
  onHover,
  onSelect,
}: {
  spec: TileSpec;
  texture: THREE.Texture;
  onHover: (p: Project | null) => void;
  onSelect: (p: Project, x: number, y: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(spec.width, spec.height),
    [spec.width, spec.height]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Eigene Uniforms steuern Hover-Helligkeit/-Schärfe und werden pro Frame
  // weich animiert.
  const uniforms = useMemo(
    () => ({ uHover: { value: 0 }, uFeather: { value: 0.13 }, uBase: { value: 0.78 } }),
    []
  );

  // MeshBasicMaterial (volles Farbmanagement) um weiche Ränder und einen
  // Hover-Boost erweitern. vTileUv ist die rohe Plane-UV (0…1), damit der
  // Feather exakt an den Kachelrändern sitzt.
  const material = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uHover = uniforms.uHover;
      shader.uniforms.uFeather = uniforms.uFeather;
      shader.uniforms.uBase = uniforms.uBase;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vTileUv;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\n  vTileUv = uv;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform float uHover;\nuniform float uFeather;\nuniform float uBase;\nvarying vec2 vTileUv;'
        )
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
  float fAmt = mix(uFeather, uFeather * 0.4, uHover);
  vec2 dEdge = min(vTileUv, 1.0 - vTileUv);
  float edgeMask = smoothstep(0.0, fAmt, dEdge.x) * smoothstep(0.0, fAmt, dEdge.y);
  gl_FragColor.a *= edgeMask;
  gl_FragColor.rgb *= mix(uBase, 1.06, uHover);`
        );
    };
    return m;
  }, [texture, uniforms]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 9);
    const target = hovered.current ? 1 : 0;
    uniforms.uHover.value += (target - uniforms.uHover.value) * k;
    meshRef.current?.scale.setScalar(1 + uniforms.uHover.value * 0.06);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
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
      // Auf dem Touchgerät gibt es kein Hover vor der Berührung. Deshalb wird
      // beim Aufsetzen des Fingers direkt hier – über den frischen Raycast der
      // Szene – die tatsächlich getroffene Kachel gemeldet.
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hovered.current = true;
        onHover(spec.project);
      }}
      // Geöffnet wird ebenfalls aus dem Raycast heraus, nicht aus einem
      // gemerkten Hover-Zustand: Sonst öffnete ein Tipp auf dem Handy das
      // Projekt, das zuletzt unter dem Zeiger lag – also ein anderes Bild.
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onSelect(spec.project, e.nativeEvent.clientX, e.nativeEvent.clientY);
      }}
    />
  );
}

function Tiles({
  onHover,
  onSelect,
}: {
  onHover: (p: Project | null) => void;
  onSelect: (p: Project, x: number, y: number) => void;
}) {
  const cells = useMemo(buildGrid, []);
  // Texturen als WebP laden (deutlich kleiner), aber weiterhin über den
  // Originalpfad referenzieren – jeder WebGL-fähige Browser kann WebP.
  const sources = useMemo(() => projects.map((p) => toWebp(p.cover)), []);
  const textures = useLoader(THREE.TextureLoader, sources);

  const tiles = useMemo(() => {
    return cells.map((cell, i) => {
      const texture = textures[i];
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return fitToCell(cell, texture);
    });
  }, [cells, textures]);

  return (
    <>
      {tiles.map((tile, i) => (
        <Tile
          key={tile.key}
          spec={tile}
          texture={textures[i]}
          onHover={onHover}
          onSelect={onSelect}
        />
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
    // Nur für die Maus – bei Touch liegt nach dem Loslassen kein Finger mehr
    // auf dem Schirm, ein nachgeführter „Hover“ wäre dort ein Phantomtreffer.
    if (l.usesMouse) state.events.update?.();
  });
  return null;
}

export function SphereScene({
  look,
  paused,
  onHover,
  onSelect,
}: {
  look: React.MutableRefObject<LookState>;
  paused: boolean;
  onHover: (p: Project | null) => void;
  onSelect: (p: Project, x: number, y: number) => void;
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
        <Tiles onHover={onHover} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
