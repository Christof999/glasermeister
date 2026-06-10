import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  cubicBezier,
  type MotionValue,
} from 'framer-motion';
import { projects, type Project } from '../data/projects';
import './FloatingProjects.css';

const easeSpread = cubicBezier(0.22, 1, 0.36, 1);
const SPREAD: [number, number] = [0.06, 0.52];

function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return compact;
}

function FloatingCard({
  project,
  progress,
  onOpen,
  index,
}: {
  project: Project;
  progress: MotionValue<number>;
  onOpen: (p: Project) => void;
  index: number;
}) {
  // Start: dicht gestapelt in der Bildschirmmitte, leicht versetzt & verdreht.
  // Beim Scrollen fächern die Karten auf ihre Position im Raum auf.
  const jitterX = ((index * 41) % 14) - 7;
  const jitterY = ((index * 67) % 12) - 6;
  const startRot = (((index * 53) % 13) - 6) * 1.1;
  const finalScale = 1 - project.depth * 0.22;
  const drift = (1 - project.depth) * 6 + 2;

  const x = useTransform(
    progress,
    SPREAD,
    [`${(50 - project.x) * 0.94 + jitterX * 0.4}vw`, '0vw'],
    { ease: easeSpread }
  );
  const y = useTransform(
    progress,
    [SPREAD[0], SPREAD[1], 1],
    [`${(50 - project.y) * 0.94 + jitterY * 0.4}vh`, '0vh', `${-drift}vh`],
    { ease: [easeSpread, easeSpread] }
  );
  const rotate = useTransform(progress, SPREAD, [startRot, 0], { ease: easeSpread });
  const scale = useTransform(progress, SPREAD, [finalScale * 0.62, finalScale], {
    ease: easeSpread,
  });
  // Beschriftung erst zeigen, wenn die Karten auseinandergefahren sind
  const labelOpacity = useTransform(progress, [0.34, 0.5], [0, 1]);

  return (
    <motion.div
      className={`fp-card fp-card--${project.size}`}
      style={
        {
          left: `${project.x}%`,
          top: `${project.y}%`,
          x,
          y,
          rotate,
          scale,
          zIndex: Math.round((1 - project.depth) * 10),
          '--fp-label-o': labelOpacity,
          '--fp-dim': 1 - project.depth * 0.4,
          '--fp-dur': `${7 + index * 1.3}s`,
          '--fp-delay': `${index * -2.1}s`,
        } as unknown as React.ComponentProps<typeof motion.div>['style']
      }
    >
      <CardButton project={project} onOpen={onOpen} />
    </motion.div>
  );
}

function CardButton({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  return (
    <button
      type="button"
      className="fp-card__btn"
      onClick={() => onOpen(project)}
      aria-haspopup="dialog"
    >
      <img src={project.cover} alt={project.title} loading="lazy" decoding="async" />
      <span className="fp-card__label">
        <strong>{project.title}</strong>
        <span>{project.category}</span>
      </span>
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fp-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Projekt: ${project.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        className="fp-modal__panel"
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="fp-modal__close" onClick={onClose} aria-label="Schließen" autoFocus>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="fp-modal__media">
          <motion.img
            key={project.images[imgIndex]}
            src={project.images[imgIndex]}
            alt={`${project.title} – Bild ${imgIndex + 1} von ${project.images.length}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          {project.images.length > 1 && (
            <div className="fp-modal__thumbs" role="tablist" aria-label="Projektbilder">
              {project.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === imgIndex}
                  className={`fp-modal__thumb ${i === imgIndex ? 'fp-modal__thumb--active' : ''}`}
                  onClick={() => setImgIndex(i)}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="fp-modal__body">
          <span className="eyebrow">{project.category}</span>
          <h3>{project.title}</h3>

          <dl className="fp-modal__facts">
            {project.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="fp-modal__story">
            {project.story.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>

          <a href="tel:+491752533137" className="btn btn--primary fp-modal__cta">
            Ähnliches Projekt? 0175 2533137
          </a>
        </div>
      </motion.article>
    </motion.div>,
    document.body
  );
}

export function FloatingProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const compact = useIsCompact();
  const reduced = useReducedMotion();
  const simple = compact || !!reduced;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Hinweis am Anfang, Titel in der Mitte sobald sich die Karten verteilen
  const hintOpacity = useTransform(scrollYProgress, [0.02, 0.12], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.52], [0, 1]);
  const titleScale = useTransform(scrollYProgress, [0.3, 0.52], [0.92, 1], {
    ease: easeSpread,
  });

  if (simple) {
    return (
      <section className="fp fp--simple section" id="projekte" aria-labelledby="projekte-h">
        <div className="container fp__head">
          <span className="eyebrow">Projekte</span>
          <h2 id="projekte-h">Meine Arbeit.</h2>
          <p className="lead">
            Jedes Projekt ein Unikat – tippen Sie ein Bild an und lesen Sie, wie
            es entstanden ist.
          </p>
        </div>
        <div className="fp__grid">
          {projects.map((proj) => (
            <div key={proj.id} className="fp-card">
              <CardButton project={proj} onOpen={setActive} />
            </div>
          ))}
        </div>
        <AnimatePresence>
          {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section className="fp" id="projekte" ref={sectionRef} aria-labelledby="projekte-h">
      <div className="fp__sticky">
        <motion.div
          className="fp__center"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <span className="eyebrow">Projekte</span>
          <h2 id="projekte-h">Meine Arbeit.</h2>
          <p>Tippen Sie ein Projekt an – dahinter steckt jeweils eine Geschichte.</p>
        </motion.div>

        <motion.p className="fp__hint" aria-hidden="true" style={{ opacity: hintOpacity }}>
          Weiter scrollen
        </motion.p>

        {projects.map((proj, i) => (
          <FloatingCard
            key={proj.id}
            project={proj}
            progress={scrollYProgress}
            onOpen={setActive}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
