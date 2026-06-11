import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';
import './ProjectModal.css';

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Der Scroll-Lock der Seite gehört dem Aufrufer (WorkSphere),
  // das Modal kümmert sich nur um die Escape-Taste.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
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
