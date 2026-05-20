import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CookieBanner.css';

const STORAGE_KEY = 'dg.notice.v1';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const id = window.setTimeout(() => setVisible(true), 400);
      return () => window.clearTimeout(id);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="notice"
          role="region"
          aria-label="Hinweis zum Datenschutz"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="notice__inner container">
            <p>
              Diese Website verwendet <strong>keine Cookies und kein Tracking</strong>.
              Es werden ausschließlich technisch notwendige Daten verarbeitet. Mehr in der{' '}
              <a href="/datenschutz">Datenschutzerklärung</a>.
            </p>
            <button type="button" className="btn btn--primary notice__btn" onClick={dismiss}>
              Verstanden
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
