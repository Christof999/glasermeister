import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { projects, type Project } from '../data/projects';
import './FloatingProjects.css';

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
  // Vordere Karten bewegen sich schneller als hintere – Tiefenstaffelung
  const shift = 40 + (1 - project.depth) * 140;
  const y = useTransform(progress, [0, 1], [shift, -shift]);
  const scale = 1 - project.depth * 0.32;

  return (
    <motion.div
      className={`fp-card fp-card--${project.size}`}
      style={
        {
          left: `${project.x}%`,
          top: `${project.y}%`,
          y,
          zIndex: Math.round((1 - project.depth) * 10),
          '--fp-scale': scale,
          '--fp-dim': 1 - project.depth * 0.45,
          '--fp-dur': `${7 + index * 1.3}s`,
          '--fp-delay': `${index * -2.1}s`,
        } as unknown as React.ComponentProps<typeof motion.div>['style']
      }
    >
      <button
        type="button"
        className="fp-card__btn"
        onClick={() => onOpen(project)}
        aria-haspopup="dialog"
      >
        <motion.img
          layoutId={`fp-img-${project.id}`}
          src={project.cover}
          alt={project.title}
          loading="lazy"
          decoding="async"
        />
        <span className="fp-card__label">
          <strong>{project.title}</strong>
          <span>{project.category}</span>
        </span>
      </button>
    </motion.div>
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
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section className="fp section" id="projekte" aria-labelledby="projekte-h">
      <div className="container fp__head">
        <span className="eyebrow">Projekte</span>
        <h2 id="projekte-h">Arbeiten, die bleiben.</h2>
        <p className="lead">
          Jedes Projekt ein Unikat – tippen Sie ein Bild an und lesen Sie, wie es
          entstanden ist.
        </p>
      </div>

      <div className="fp__stage" ref={stageRef}>
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
