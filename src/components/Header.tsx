import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../data/services';
import './Header.css';

const navItems = [
  { to: '/', label: 'Start', end: true },
  { to: '/referenzen', label: 'Referenzen' },
  { to: '/ueber-uns', label: 'Über uns' },
  { to: '/kontakt', label: 'Kontakt' },
];

const drawerStagger = {
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.18 },
  },
};

const drawerItem = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [leistungenOpen, setLeistungenOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLeistungenOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="logo" aria-label="der-glasermeister – zur Startseite">
          <span className="logo__mark">der-glasermeister</span>
        </Link>

        <nav className="nav nav--desktop" aria-label="Hauptnavigation">
          <ul>
            <li
              className="nav__has-submenu"
              onMouseEnter={() => setLeistungenOpen(true)}
              onMouseLeave={() => setLeistungenOpen(false)}
            >
              <button
                type="button"
                className="nav__link nav__link--button"
                aria-expanded={leistungenOpen}
                aria-haspopup="true"
                onClick={() => setLeistungenOpen((v) => !v)}
                onFocus={() => setLeistungenOpen(true)}
              >
                Leistungen
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  style={{
                    transform: leistungenOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 200ms ease',
                  }}
                >
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {leistungenOpen && (
                  <motion.div
                    className="submenu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    role="menu"
                  >
                    <ul>
                      {services.map((s) => (
                        <li key={s.slug} role="none">
                          <NavLink
                            to={`/leistungen/${s.slug}`}
                            className="submenu__link"
                            role="menuitem"
                          >
                            {s.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav__link ${isActive ? 'nav__link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <a href="tel:+491752533137" className="header-cta" aria-label="Telefon: 0175 2533137">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span>0175 2533137</span>
        </a>

        <button
          type="button"
          className="burger"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className={`burger__line ${open ? 'burger__line--a' : ''}`} />
          <span aria-hidden="true" className={`burger__line ${open ? 'burger__line--b' : ''}`} />
          <span aria-hidden="true" className={`burger__line ${open ? 'burger__line--c' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer – portal to body so backdrop-filter on header doesn't trap position:fixed */}
      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="drawer-backdrop"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.aside
              key="drawer"
              id="mobile-nav"
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Hauptnavigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="drawer__head">
                <span className="drawer__logo" aria-hidden="true">der-glasermeister</span>
                <button
                  type="button"
                  className="drawer__close"
                  aria-label="Menü schließen"
                  onClick={() => setOpen(false)}
                  autoFocus
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <motion.nav
                className="drawer__nav"
                variants={drawerStagger}
                initial="hidden"
                animate="visible"
                aria-label="Mobile Navigation"
              >
                <motion.div className="drawer__item" variants={drawerItem}>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                    }
                  >
                    <span>Start</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="drawer__arrow">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </NavLink>
                </motion.div>

                <motion.div className="drawer__item drawer__group" variants={drawerItem}>
                  <span className="drawer__group-label">Leistungen</span>
                  <ul className="drawer__sublist">
                    {services.map((s, i) => (
                      <motion.li
                        key={s.slug}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.28 + i * 0.05,
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <NavLink
                          to={`/leistungen/${s.slug}`}
                          className={({ isActive }) =>
                            `drawer__sublink ${isActive ? 'drawer__sublink--active' : ''}`
                          }
                        >
                          <span className="drawer__sub-dot" aria-hidden="true" />
                          {s.title}
                        </NavLink>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {navItems.slice(1).map((item) => (
                  <motion.div key={item.to} className="drawer__item" variants={drawerItem}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `drawer__link ${isActive ? 'drawer__link--active' : ''}`
                      }
                    >
                      <span>{item.label}</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="drawer__arrow">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                className="drawer__cta"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="tel:+491752533137" className="btn btn--primary drawer__cta-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  0175 2533137
                </a>
                <a href="mailto:info@der-glasermeister.de" className="drawer__email">
                  info@der-glasermeister.de
                </a>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body)}
    </header>
  );
}
