import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GlassCutGame.css';

const PANE_MM = 1000;

const randomTarget = () => 150 + Math.round(Math.random() * 700);

function verdict(diff: number): { title: string; sub: string; broken: boolean } {
  if (diff <= 2) return { title: 'Meisterhaft.', sub: 'Auf den Millimeter – Sie sind eingestellt.', broken: false };
  if (diff <= 5) return { title: 'Fast perfekt.', sub: 'Das würde in der Werkstatt durchgehen.', broken: false };
  if (diff <= 12) return { title: 'Solide Arbeit.', sub: 'Ein Geselle wäre stolz – der Meister schleift nach.', broken: false };
  if (diff <= 25) return { title: 'Knapp daneben.', sub: 'Beim getönten ESG gäbe es keinen zweiten Versuch …', broken: false };
  return { title: 'Bruch!', sub: 'Das Glas ist hin. Gut, dass es nur ein Pixel-Glas war.', broken: true };
}

export function GlassCutGame() {
  const paneRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState(randomTarget);
  const [aim, setAim] = useState<number | null>(null);
  const [cut, setCut] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const toMm = useCallback((clientX: number) => {
    const el = paneRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.round(Math.min(1, Math.max(0, ratio)) * PANE_MM);
  }, []);

  const doCut = useCallback(
    (mm: number) => {
      setCut(mm);
      const diff = Math.abs(mm - target);
      setBest((b) => (b === null ? diff : Math.min(b, diff)));
    },
    [target]
  );

  const reset = () => {
    setCut(null);
    setAim(null);
    setTarget(randomTarget());
  };

  const diff = cut !== null ? Math.abs(cut - target) : 0;
  const result = cut !== null ? verdict(diff) : null;
  const aimMm = aim ?? Math.round(PANE_MM / 2);

  return (
    <section className="game section" aria-labelledby="game-h">
      <div className="container">
        <span className="eyebrow">Zum Schluss: Hand anlegen</span>
        <h2 id="game-h">Schaffen Sie den Glasschnitt?</h2>
        <p className="lead">
          In der Werkstatt zählt jeder Millimeter. Setzen Sie den Schnitt bei{' '}
          <strong className="game__target-val">{target} mm</strong> – ein Klick, ein Schnitt.
        </p>

        <div className="game__bench">
          <div className="game__ruler" aria-hidden="true">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className="game__tick">
                <i />
                {i * 100}
              </span>
            ))}
          </div>

          <div
            ref={paneRef}
            className={`game__pane ${cut === null ? 'game__pane--live' : ''}`}
            role="slider"
            tabIndex={0}
            aria-label={`Glasschnitt setzen, Ziel ${target} Millimeter`}
            aria-valuemin={0}
            aria-valuemax={PANE_MM}
            aria-valuenow={cut ?? aimMm}
            aria-valuetext={`${cut ?? aimMm} Millimeter`}
            onPointerMove={(e) => cut === null && setAim(toMm(e.clientX))}
            onPointerUp={(e) => cut === null && doCut(toMm(e.clientX))}
            onKeyDown={(e) => {
              if (cut !== null) return;
              if (e.key === 'ArrowLeft') setAim(Math.max(0, aimMm - (e.shiftKey ? 10 : 1)));
              if (e.key === 'ArrowRight') setAim(Math.min(PANE_MM, aimMm + (e.shiftKey ? 10 : 1)));
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                doCut(aimMm);
              }
            }}
          >
            {/* Glashälften */}
            <motion.div
              className={`game__half game__half--left ${result?.broken ? 'game__half--broken' : ''}`}
              style={{ width: `${((cut ?? PANE_MM) / PANE_MM) * 100}%` }}
              animate={
                cut !== null
                  ? result?.broken
                    ? { x: -14, rotate: -1.6, y: 6 }
                    : { x: -22 }
                  : { x: 0 }
              }
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            />
            <motion.div
              className={`game__half game__half--right ${result?.broken ? 'game__half--broken' : ''}`}
              style={{ width: `${(1 - (cut ?? 0) / PANE_MM) * 100}%` }}
              animate={
                cut !== null
                  ? result?.broken
                    ? { x: 14, rotate: 2.1, y: 10 }
                    : { x: 22 }
                  : { x: 0 }
              }
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            />

            {/* Ziellinie */}
            <span
              className="game__line game__line--target"
              style={{ left: `${(target / PANE_MM) * 100}%` }}
              aria-hidden="true"
            >
              <em>{target}</em>
            </span>

            {/* Schnittlinie */}
            {cut === null && aim !== null && (
              <span
                className="game__line game__line--aim"
                style={{ left: `${(aim / PANE_MM) * 100}%` }}
                aria-hidden="true"
              >
                <em>{aim}</em>
              </span>
            )}
            {cut !== null && (
              <span
                className="game__line game__line--cut"
                style={{ left: `${(cut / PANE_MM) * 100}%` }}
                aria-hidden="true"
              />
            )}

            {result?.broken && (
              <svg className="game__cracks" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
                <path d={`M ${cut! / 10} 0 l -6 14 l 9 8 l -12 13 l 7 10 l -9 15`} />
                <path d={`M ${cut! / 10} 18 l 10 6 l -4 12 l 13 9`} />
                <path d={`M ${cut! / 10} 30 l -14 4 l 5 12 l -16 8`} />
              </svg>
            )}
          </div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                className="game__result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className={`game__verdict ${result.broken ? 'game__verdict--broken' : ''}`}>
                  {result.title}
                </p>
                <p className="game__detail">
                  Ihr Schnitt: {cut} mm · Abweichung {diff} mm. {result.sub}
                </p>
                <div className="game__actions">
                  <button type="button" className="btn btn--primary" onClick={reset}>
                    Neues Glas auflegen
                  </button>
                  {best !== null && (
                    <span className="game__best">Beste Abweichung: {best} mm</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="game__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Bewegen Sie den Schneider über das Glas und klicken Sie zum Schneiden.
                Auf der Tastatur: Pfeiltasten + Enter.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
