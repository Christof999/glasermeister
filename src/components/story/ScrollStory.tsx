import { lazy, Suspense, useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import './ScrollStory.css';

const GlassScene = lazy(() =>
  import('./GlassScene').then((m) => ({ default: m.GlassScene }))
);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type CaptionProps = {
  progress: MotionValue<number>;
  range: [number, number];
  index: string;
  title: string;
  children: ReactNode;
};

function Caption({ progress, range, index, title, children }: CaptionProps) {
  const [from, to] = range;
  const fade = 0.04;
  const opacity = useTransform(
    progress,
    [from, from + fade, to - fade, to],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [from, from + fade], [24, 0]);
  return (
    <motion.div className="story__caption" style={{ opacity, y }}>
      <span className="story__caption-num">{index}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </motion.div>
  );
}

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLElement | null>(null);
  const sceneProgress = useRef(0);
  const reduced = useReducedMotion();
  const inView = useInView(containerRef, { margin: '400px 0px 400px 0px' });

  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(p, 'change', (v) => {
    sceneProgress.current = clamp01((v - 0.5) / (0.78 - 0.5));
  });

  // Intro
  const introOpacity = useTransform(p, [0, 0.07, 0.11], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.11], [0, -60]);

  // Gemeinsame Bühne: Vorherfoto wird kleiner und wandert nach links,
  // Skizze und 3D-Canvas bleiben dadurch sauber daran gekoppelt.
  const frameOpacity = useTransform(p, [0.03, 0.09], [0, 1]);
  const stageScale = useTransform(p, [0.03, 0.13, 0.28], [1.06, 1, 0.78]);
  const stageX = useTransform(p, [0.13, 0.28], ['0vw', '-14vw']);
  const stageY = useTransform(p, [0.13, 0.28], ['0vh', '-4vh']);
  const vorherFilter = useTransform(
    p,
    [0.44, 0.54, 0.82, 0.92],
    ['brightness(1)', 'brightness(0.48)', 'brightness(0.48)', 'brightness(1)']
  );
  const nachherOpacity = useTransform(p, [0.82, 0.94], [0, 1]);
  const tagVorher = useTransform(p, [0.08, 0.12, 0.34, 0.38], [0, 1, 1, 0]);
  const tagNachher = useTransform(p, [0.86, 0.94], [0, 1]);

  // Bleistift-Annotationen (Fenster im Scrollverlauf)
  const sketch = useTransform(p, [0.24, 0.34], [0, 1]);
  const sketchPanel = useTransform(p, [0.3, 0.4], [0, 1]);
  const dimH = useTransform(p, [0.34, 0.42], [0, 1]);
  const dimW = useTransform(p, [0.38, 0.46], [0, 1]);
  const bevel = useTransform(p, [0.42, 0.48], [0, 1]);
  const radius = useTransform(p, [0.46, 0.52], [0, 1]);
  const note = useTransform(p, [0.5, 0.58], [0, 1]);
  const hinge = useTransform(p, [0.54, 0.62], [0, 1]);
  const angle = useTransform(p, [0.58, 0.66], [0, 1]);
  const annoOut = useTransform(p, [0.8, 0.9], [1, 0]);

  // 3D-Scheiben kommen erst nach fertig gezeichneter Skizze dazu.
  const canvasOpacity = useTransform(p, [0.5, 0.58, 0.8, 0.9], [0, 1, 1, 0]);
  const showCanvas = inView && !reduced;

  return (
    <section
      className="story"
      ref={containerRef}
      id="projekt-schulstrasse"
      aria-label="Projektgeschichte: Eine Dusche entsteht"
    >
      <div className="story__sticky">
        {/* Intro */}
        <motion.div className="story__intro" style={{ opacity: introOpacity, y: introY }}>
          <span className="eyebrow">Projekt Schulstraße</span>
          <h2>
            Wie aus zwei Zeichnungen
            <br />
            <em>eine Dusche wird.</em>
          </h2>
          <div className="story__scrollhint" aria-hidden="true">
            <span>Scrollen</span>
            <span className="story__scrollline" />
          </div>
        </motion.div>

        {/* Foto-, Skizzen- und Glas-Bühne */}
        <motion.div
          className="story__stage"
          style={{ opacity: frameOpacity, x: stageX, y: stageY, scale: stageScale }}
        >
          <motion.figure className="story__frame" ref={frameRef}>
            <motion.img
              src="/images/schulstrasse/img_1537.jpg"
              alt="Geflieste Duschnische unter der Dachschräge, noch ohne Glas"
              style={{ filter: vorherFilter }}
              loading="lazy"
              decoding="async"
              width="1200"
              height="1600"
            />
            <motion.img
              className="story__after"
              src="/images/schulstrasse/img_1683.jpg"
              alt="Fertige Dusche mit grauer Glastür und Seitenteil unter der Dachschräge"
              style={{ opacity: nachherOpacity }}
              loading="lazy"
              decoding="async"
              width="1200"
              height="1600"
            />

            <motion.span className="story__tag" style={{ opacity: tagVorher }}>
              Vorher
            </motion.span>
            <motion.span className="story__tag story__tag--after" style={{ opacity: tagNachher }}>
              Nachher
            </motion.span>

            {/* Bleistift-Aufmaß */}
            <motion.svg
              className="story__anno"
              viewBox="0 0 600 800"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              style={{ opacity: annoOut }}
            >
            {/* Aufmaß-Skizze im Vorherfoto: bewusst als Zeichnung, nicht als
               künstliche Ersatzscheibe. Das echte Ergebnis folgt im Foto-Fade. */}
            <motion.path
              className="anno-line anno-line--dashed"
              d="M 514 290 L 512 782 L 252 728 L 258 356 L 318 286 Z"
              style={{ pathLength: sketch, opacity: sketch }}
            />
            {/* Seitenteil über Sitzbank und Dachschräge */}
            <motion.path
              className="anno-line anno-line--dashed"
              d="M 252 728 L 196 690 L 196 594 L 214 528 L 258 356 Z"
              style={{ pathLength: sketchPanel, opacity: sketchPanel }}
            />
            {/* Höhe 1455 – an der Wandkante rechts */}
            <motion.g style={{ opacity: dimH }}>
              <motion.path
                className="anno-line"
                d="M 536 302 L 536 776 M 527 306 L 545 298 M 527 780 L 545 772"
                style={{ pathLength: dimH }}
              />
              <text className="anno-text" x="550" y="548" transform="rotate(-90 550 548)">
                1455
              </text>
            </motion.g>
            {/* Breite 753 – parallel zur Tassenvorderkante */}
            <motion.g style={{ opacity: dimW }}>
              <motion.path
                className="anno-line"
                d="M 246 746 L 506 796 M 250 737 L 242 755 M 510 787 L 502 805"
                style={{ pathLength: dimW }}
              />
              <text className="anno-text" x="354" y="744" transform="rotate(9 354 744)">
                753
              </text>
            </motion.g>
            {/* Eckschräge 569 – folgt dem Balken */}
            <motion.g style={{ opacity: bevel }}>
              <motion.path
                className="anno-line"
                d="M 260 354 L 318 286"
                style={{ pathLength: bevel }}
              />
              <text className="anno-text" x="336" y="274">
                Schräge · 569
              </text>
            </motion.g>
            {/* Radius */}
            <motion.g style={{ opacity: radius }}>
              <motion.path
                className="anno-line"
                d="M 486 306 q 18 -14 30 -6"
                style={{ pathLength: radius }}
              />
              <text className="anno-text" x="450" y="340">
                R8
              </text>
            </motion.g>
            {/* Materialnotiz – frei auf der Dachschräge, zweizeilig */}
            <motion.g style={{ opacity: note }} transform="rotate(-2 335 86)">
              <text className="anno-text anno-text--big" x="335" y="86">
                Parsol grau
              </text>
              <text className="anno-text anno-text--big" x="335" y="128">
                8 mm ESG
              </text>
              <motion.path
                className="anno-line"
                d="M 333 142 q 50 9 100 2 q 36 -5 62 3"
                style={{ pathLength: note }}
              />
            </motion.g>
            {/* Bandaussparung – Pfeil zur Schlagkante an der Wand */}
            <motion.g style={{ opacity: hinge }}>
              <text className="anno-text" x="334" y="452" transform="rotate(-2 334 452)">
                Aussparung 52 × 84
              </text>
              <motion.path
                className="anno-line"
                d="M 460 456 Q 518 524 508 646 M 508 646 l -13 -8 M 508 646 l 3 -15"
                style={{ pathLength: hinge }}
              />
            </motion.g>
            {/* Winkel – an der Stufenecke des Seitenteils */}
            <motion.g style={{ opacity: angle }}>
              <motion.path
                className="anno-line"
                d="M 192 632 q 20 -10 28 -26"
                style={{ pathLength: angle }}
              />
              <text className="anno-text" x="78" y="678" transform="rotate(2 78 678)">
                kein rechter Winkel!
              </text>
            </motion.g>
            </motion.svg>
          </motion.figure>

          <motion.div className="story__canvas" style={{ opacity: canvasOpacity }}>
            {showCanvas && (
              <Suspense fallback={null}>
                <GlassScene progressRef={sceneProgress} frameRef={frameRef} />
              </Suspense>
            )}
          </motion.div>
        </motion.div>

        {/* Kapitel */}
        <div className="story__captions">
          <Caption progress={p} range={[0.09, 0.18]} index="01" title="Vorher">
            Ein Bad unterm Dach, fertig gefliest – nur die Dusche ist noch offen.
            Der Balken von 1780 bleibt, das Glas muss sich fügen.
          </Caption>
          <Caption progress={p} range={[0.18, 0.46]} index="02" title="Das Aufmaß">
            Jede Kante wird vor Ort auf den Millimeter aufgenommen und in die
            Zeichnung übertragen – hier ist kein Winkel ein rechter.
          </Caption>
          <Caption progress={p} range={[0.48, 0.85]} index="03" title="Das Glas">
            Türblatt und Seitenteil aus grau getöntem Sicherheitsglas, Kanten
            feingeschliffen. Gefertigt nach Zeichnung – passend beim ersten Einsetzen.
          </Caption>
          <Caption progress={p} range={[0.89, 1]} index="04" title="Nachher">
            Als wäre es immer da gewesen. Maßarbeit sieht man ihr nicht an –
            genau das ist der Punkt.
          </Caption>
        </div>
      </div>
    </section>
  );
}
