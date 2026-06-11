import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { projects, type Project } from '../../data/projects';
import { ProjectModal } from '../ProjectModal';
import { createLookState } from './lookState';
import './WorkSphere.css';

// three.js erst laden, wenn die Sphäre tatsächlich betreten wird
const SphereScene = lazy(() =>
  import('./SphereScene').then((m) => ({ default: m.SphereScene }))
);

const TITLE = 'Meine Arbeiten entdecken';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/* ----------------------------------------------- Scroll-Überschrift */

function ScrollLetter({
  ch,
  index,
  total,
  progress,
}: {
  ch: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = 0.08 + (index / total) * 0.3;
  const end = start + 0.14;
  const y = useTransform(progress, [start, end], ['1.1em', '0em']);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const rotate = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span className="ws__letter" style={{ y, opacity, rotate }}>
      {ch}
    </motion.span>
  );
}

function ScrollTitle({ progress }: { progress: MotionValue<number> }) {
  const words = useMemo(() => TITLE.split(' '), []);
  const total = TITLE.replace(/ /g, '').length;
  let letterIndex = 0;
  return (
    <h2 id="projekte-h" className="ws__title" aria-label={TITLE}>
      {words.map((word) => (
        <span key={word} className="ws__word" aria-hidden="true">
          {word.split('').map((ch, i) => {
            const idx = letterIndex++;
            return (
              <ScrollLetter key={`${word}-${i}`} ch={ch} index={idx} total={total} progress={progress} />
            );
          })}
        </span>
      ))}
    </h2>
  );
}

/* ----------------------------------------------- Tunnel-Transition */

function Tunnel({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const [stage, setStage] = useState<'grow' | 'reveal'>('grow');
  return (
    <div className="ws-tunnel" aria-hidden="true">
      {stage === 'grow' ? (
        <>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="ws-tunnel__ring"
              initial={{ scale: 0.002, opacity: 0.9 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1.15, delay: i * 0.14, ease: [0.6, 0, 0.9, 0.4] }}
            />
          ))}
          <motion.span
            className="ws-tunnel__dot"
            initial={{ scale: 0.004 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 1.25, ease: [0.62, 0, 0.9, 0.35] }}
            onAnimationComplete={() => {
              onCovered();
              setStage('reveal');
            }}
          />
        </>
      ) : (
        <motion.span
          className="ws-tunnel__flash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          onAnimationComplete={onDone}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------- Fallback-Grid */

function ProjectGrid({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div className="ws__grid">
      {projects.map((p) => (
        <button key={p.id} type="button" className="ws-card" onClick={() => onOpen(p)} aria-haspopup="dialog">
          <img src={p.cover} alt={p.title} loading="lazy" decoding="async" />
          <span className="ws-card__label">
            <strong>{p.title}</strong>
            <span>{p.category}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------- Sphere-Raum */

function SphereRoom({
  onExit,
  active,
  setActive,
}: {
  onExit: () => void;
  active: Project | null;
  setActive: (p: Project | null) => void;
}) {
  const look = useRef(createLookState());
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (drag.current && e.pointerId === drag.current.id) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      look.current.dragYaw += dx * 0.0042;
      look.current.dragPitch += dy * 0.0032;
      return;
    }
    if (e.pointerType === 'mouse') {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      look.current.mouseYaw = -nx * Math.PI * 1.5;
      look.current.mousePitch = -ny * 0.85;
    }
  };

  return (
    <div
      className={`ws-room ${hovered ? 'ws-room--hover' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Meine Arbeiten – begehbarer 3D-Raum"
      onPointerDown={(e) => {
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <Suspense fallback={null}>
        <SphereScene look={look} paused={!!active} onSelect={setActive} onHover={setHovered} />
      </Suspense>

      <div className="ws-room__vignette" aria-hidden="true" />

      <button type="button" className="ws-room__exit" onClick={onExit}>
        exit the sphere
      </button>

      <p className="ws-room__hud" aria-live="polite">
        {hovered ? (
          <>
            <strong>{hovered.title}</strong>
            <span>{hovered.category}</span>
          </>
        ) : (
          <span className="ws-room__hint">
            Umsehen: Maus bewegen oder wischen · Projekt antippen für Details
          </span>
        )}
      </p>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------------------- Sektion */

export function WorkSphere() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(true);
  const [inSphere, setInSphere] = useState(false);
  const [tunnel, setTunnel] = useState<null | 'enter' | 'exit'>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => setWebgl(supportsWebGL()), []);
  const fallback = !!reduced || !webgl;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const ctaOpacity = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.42, 0.55], [24, 0]);

  // Seite hinter Sphere/Tunnel nicht scrollen lassen (Modal regelt sich selbst)
  useEffect(() => {
    if (inSphere || tunnel) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [inSphere, tunnel, active]);

  const enter = useCallback(() => {
    if (tunnel) return;
    // Szene & Cover schon während der Tunnelfahrt laden
    import('./SphereScene');
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.cover;
    });
    setTunnel('enter');
  }, [tunnel]);

  const exit = useCallback(() => {
    if (!tunnel) setTunnel('exit');
  }, [tunnel]);

  // Escape verlässt die Sphere (das Modal fängt Escape vorher ab)
  useEffect(() => {
    if (!inSphere) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !active) exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inSphere, active, exit]);

  if (fallback) {
    return (
      <section className="ws ws--simple section" id="projekte" aria-labelledby="projekte-h">
        <div className="container ws__head">
          <span className="eyebrow">Projekte</span>
          <h2 id="projekte-h">{TITLE}</h2>
          <p className="lead">
            Jedes Projekt ein Unikat – tippen Sie ein Bild an und lesen Sie, wie es entstanden ist.
          </p>
        </div>
        <ProjectGrid onOpen={setActive} />
        <AnimatePresence>
          {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section className="ws" id="projekte" ref={sectionRef} aria-labelledby="projekte-h">
      <div className="ws__sticky">
        <span className="eyebrow">Projekte</span>
        <ScrollTitle progress={scrollYProgress} />
        <motion.div className="ws__cta" style={{ opacity: ctaOpacity, y: ctaY }}>
          <p>Sieben Projekte, ein Raum – mittendrin statt davor.</p>
          <button type="button" className="ws__enter" onClick={enter}>
            <span className="ws__enter-dot" aria-hidden="true" />
            enter the sphere
          </button>
        </motion.div>
      </div>

      {inSphere && <SphereRoom onExit={exit} active={active} setActive={setActive} />}

      {tunnel && (
        <Tunnel
          onCovered={() => {
            if (tunnel === 'enter') {
              setInSphere(true);
            } else {
              setActive(null);
              setInSphere(false);
            }
          }}
          onDone={() => setTunnel(null)}
        />
      )}
    </section>
  );
}
