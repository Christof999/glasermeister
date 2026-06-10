import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  cubicBezier,
} from 'framer-motion';
import { Logo } from '../Logo';
import './LaserIntro.css';

const easeSmooth = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Startsequenz: Die Wortmarke wird per „Laser" in eine Glasscheibe graviert.
 * Beim Scrollen löst sich die Scheibe auf und das Logo fliegt verkleinert in
 * die Header-Ecke, wo es nahtlos an das echte Header-Logo übergibt.
 */
export function LaserIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const engraved = useInView(sectionRef, { once: true, amount: 0.4 });
  const [target, setTarget] = useState({ x: 0, y: 0, scale: 0.2 });

  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Zielposition = Logo im Header (wird bei Mount & Resize vermessen)
  useEffect(() => {
    const measure = () => {
      const headerLogo = document.querySelector('.site-header .logo__svg');
      const intro = logoRef.current;
      if (!headerLogo || !intro) return;
      const h = headerLogo.getBoundingClientRect();
      // Intro-Logo liegt unskaliert im Viewport-Zentrum
      const iw = Math.min(window.innerWidth * 0.74, 720);
      const ih = iw / (756 / 83);
      const icx = window.innerWidth / 2;
      const icy = window.innerHeight / 2;
      setTarget({
        x: h.left + h.width / 2 - icx,
        y: h.top + h.height / 2 - icy,
        scale: h.height / ih,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Header-Logo erst zeigen, wenn das Intro-Logo in der Ecke angekommen ist
  useEffect(() => {
    if (reduced) return;
    document.documentElement.style.setProperty('--intro-logo-handoff', '0');
    return () => {
      document.documentElement.style.removeProperty('--intro-logo-handoff');
    };
  }, [reduced]);

  useMotionValueEvent(p, 'change', (v) => {
    if (reduced) return;
    document.documentElement.style.setProperty(
      '--intro-logo-handoff',
      v > 0.78 ? '1' : '0'
    );
  });

  const paneOpacity = useTransform(p, [0.12, 0.42], [1, 0]);
  const paneScale = useTransform(p, [0.12, 0.5], [1, 1.07]);
  const taglineOpacity = useTransform(p, [0.04, 0.16], [1, 0]);

  const x = useTransform(p, [0.2, 0.78], [0, target.x], { ease: easeSmooth });
  const y = useTransform(p, [0.2, 0.78], [0, target.y], { ease: easeSmooth });
  const scale = useTransform(p, [0.2, 0.78], [1, target.scale], { ease: easeSmooth });
  const logoOpacity = useTransform(p, [0.76, 0.82], [1, 0]);

  // Laser-Gravur (einmalig, sobald sichtbar)
  const beamTransition = { duration: 2.2, delay: 0.35, ease: 'linear' as const };

  if (reduced) {
    return (
      <section className="intro intro--static" aria-label="der-glasermeister">
        <div className="intro__sticky">
          <div className="intro__pane" />
          <h1 className="intro__logo">
            <Logo className="intro__logo-svg" title="der-glasermeister – Glaserei Patrick Stettner, Merkendorf" />
          </h1>
          <p className="intro__tagline">Glaserei · Patrick Stettner · Merkendorf</p>
        </div>
      </section>
    );
  }

  return (
    <section className="intro" ref={sectionRef} aria-label="der-glasermeister">
      <div className="intro__sticky">
        {/* Glasscheibe */}
        <motion.div
          className="intro__pane"
          aria-hidden="true"
          style={{ opacity: paneOpacity, scale: paneScale }}
        >
          <span className="intro__bolt intro__bolt--tl" />
          <span className="intro__bolt intro__bolt--tr" />
          <span className="intro__bolt intro__bolt--bl" />
          <span className="intro__bolt intro__bolt--br" />
        </motion.div>

        {/* Gravierte Wortmarke */}
        <motion.h1
          className="intro__logo"
          ref={logoRef}
          style={{ x, y, scale, opacity: logoOpacity }}
        >
          <span className="sr-only">
            der-glasermeister – Glaserei Patrick Stettner, Merkendorf
          </span>
          <motion.span
            className="intro__logo-reveal"
            aria-hidden="true"
            initial={{ clipPath: 'inset(-30% 105% -30% -2%)' }}
            animate={engraved ? { clipPath: 'inset(-30% -2% -30% -2%)' } : undefined}
            transition={beamTransition}
          >
            <Logo className="intro__logo-svg" />
          </motion.span>

          {/* Laserstrahl */}
          <motion.span
            className="intro__beam"
            aria-hidden="true"
            initial={{ left: '-2%', opacity: 0 }}
            animate={
              engraved
                ? { left: ['-2%', '102%'], opacity: [0, 1, 1, 0] }
                : undefined
            }
            transition={{ ...beamTransition, opacity: { ...beamTransition, times: [0, 0.06, 0.94, 1] } }}
          />
        </motion.h1>

        <motion.div className="intro__foot" style={{ opacity: taglineOpacity }}>
          <p className="intro__tagline">Glaserei · Patrick Stettner · Merkendorf</p>
          <div className="intro__scrollhint" aria-hidden="true">
            <span>Scrollen</span>
            <span className="intro__scrollline" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
