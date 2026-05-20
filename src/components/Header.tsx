import { useEffect, useState } from 'react';
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
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="nav nav--mobile"
            aria-label="Hauptnavigation mobil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {navItems.slice(0, 1).map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end className="nav__link">{item.label}</NavLink>
                </li>
              ))}
              <li>
                <details className="mobile-submenu">
                  <summary>Leistungen</summary>
                  <ul>
                    {services.map((s) => (
                      <li key={s.slug}>
                        <NavLink to={`/leistungen/${s.slug}`} className="nav__link">{s.title}</NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
              {navItems.slice(1).map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="nav__link">{item.label}</NavLink>
                </li>
              ))}
            </ul>
            <a href="tel:+491752533137" className="btn btn--primary nav--mobile__cta">
              Jetzt anrufen
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
