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
import { Logo, LOGO_PATH, LOGO_VIEWBOX } from '../Logo';
import './LaserIntro.css';

const easeSmooth = cubicBezier(0.22, 1, 0.36, 1);

const ENGRAVE_DELAY = 0.35; // s
const ENGRAVE_DURATION = 3.6; // s

/**
 * Startsequenz: Ein Laserpunkt fährt die Buchstabenkonturen der Wortmarke
 * nach und „schreibt" sie so in eine Glasscheibe. Beim Scrollen löst sich
 * die Scheibe auf und das Logo fliegt verkleinert in die Header-Ecke, wo es
 * nahtlos an das echte Header-Logo übergibt.
 */
export function LaserIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const reduced = useReducedMotion();
  const engraved = useInView(sectionRef, { once: true, amount: 0.4 });
  const [engraveDone, setEngraveDone] = useState(false);
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

  // Laserpunkt folgt der Kontur, während der Strich gezeichnet wird
  useEffect(() => {
    if (!engraved || reduced) return;
    const path = strokeRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!path || !dot || !glow) return;

    const total = path.getTotalLength();
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0 - ENGRAVE_DELAY * 1000) / (ENGRAVE_DURATION * 1000));
      if (t >= 0) {
        const pt = path.getPointAtLength(Math.max(0, t) * total);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
        glow.setAttribute('cx', String(pt.x));
        glow.setAttribute('cy', String(pt.y));
        const vis = t < 1 ? '1' : '0';
        dot.style.opacity = vis;
        glow.style.opacity = vis;
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setEngraveDone(true);
      }
    };
    dot.style.opacity = '0';
    glow.style.opacity = '0';
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engraved, reduced]);

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
      v > 0.84 ? '1' : '0'
    );
  });

  const paneOpacity = useTransform(p, [0.1, 0.38], [1, 0]);
  const paneScale = useTransform(p, [0.1, 0.45], [1, 1.07]);
  const taglineOpacity = useTransform(p, [0.03, 0.14], [1, 0]);

  const x = useTransform(p, [0.16, 0.86], [0, target.x], { ease: easeSmooth });
  const y = useTransform(p, [0.16, 0.86], [0, target.y], { ease: easeSmooth });
  const scale = useTransform(p, [0.16, 0.86], [1, target.scale], { ease: easeSmooth });
  const logoOpacity = useTransform(p, [0.84, 0.9], [1, 0]);

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

        {/* Wortmarke, vom Laser geschrieben */}
        <motion.h1
          className="intro__logo"
          ref={logoRef}
          style={{ x, y, scale, opacity: logoOpacity }}
        >
          <span className="sr-only">
            der-glasermeister – Glaserei Patrick Stettner, Merkendorf
          </span>
          <svg
            className="intro__logo-svg"
            viewBox={LOGO_VIEWBOX}
            aria-hidden="true"
            overflow="visible"
          >
            {/* Gravur-Füllung, erscheint nach dem Schreiben */}
            <motion.path
              className="intro__logo-fill"
              d={LOGO_PATH}
              fillRule="evenodd"
              initial={{ opacity: 0 }}
              animate={engraveDone ? { opacity: 1 } : undefined}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            {/* Kontur, die der Laser nachfährt */}
            <motion.path
              ref={strokeRef}
              className="intro__logo-stroke"
              d={LOGO_PATH}
              initial={{ pathLength: 0 }}
              animate={engraved ? { pathLength: 1 } : undefined}
              transition={{
                duration: ENGRAVE_DURATION,
                delay: ENGRAVE_DELAY,
                ease: 'linear',
              }}
            />
            {/* Laserpunkt */}
            <circle ref={glowRef} className="intro__laser-glow" r="13" style={{ opacity: 0 }} />
            <circle ref={dotRef} className="intro__laser-dot" r="3.2" style={{ opacity: 0 }} />
          </svg>
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
