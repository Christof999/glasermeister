import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '../i18n';
import './CookieBanner.css';

const STORAGE_KEY = 'dg.notice.v1';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useT();

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
          aria-label={t('cookie.aria')}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="notice__inner container">
            <p>
              {t('cookie.pre')}
              <strong>{t('cookie.strong')}</strong>
              {t('cookie.mid')}
              <a href="/datenschutz">{t('cookie.linkText')}</a>
              {t('cookie.post')}
            </p>
            <button type="button" className="btn btn--primary notice__btn" onClick={dismiss}>
              {t('cookie.ok')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
