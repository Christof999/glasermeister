import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toWebp } from '../lib/img';
import './Lightbox.css';

type Props = {
  images: string[];
  alts: string[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ images, alts, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    if (index === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [index, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Schließen"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Vorheriges Bild"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M14 4l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

          <picture className="pic">
            <source type="image/webp" srcSet={toWebp(images[index])} />
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={alts[index] ?? ''}
              className="lightbox__image"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            />
          </picture>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Nächstes Bild"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M8 4l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

          <div className="lightbox__counter" aria-live="polite">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
