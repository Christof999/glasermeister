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

// three.js erst laden, wenn die Story in Sichtweite kommt
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
    sceneProgress.current = clamp01((v - 0.46) / (0.88 - 0.46));
  });

  // Intro
  const introOpacity = useTransform(p, [0, 0.07, 0.11], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.11], [0, -60]);

  // Foto-Rahmen (Vorher → Nachher)
  const frameOpacity = useTransform(p, [0.03, 0.09], [0, 1]);
  const frameScale = useTransform(p, [0.03, 0.45], [1.06, 1]);
  const vorherFilter = useTransform(
    p,
    [0.42, 0.52, 0.84, 0.92],
    ['brightness(1)', 'brightness(0.3)', 'brightness(0.3)', 'brightness(1)']
  );
  const nachherOpacity = useTransform(p, [0.86, 0.94], [0, 1]);
  const tagVorher = useTransform(p, [0.08, 0.12, 0.42, 0.46], [0, 1, 1, 0]);
  const tagNachher = useTransform(p, [0.9, 0.96], [0, 1]);

  // Bleistift-Annotationen (Fenster im Scrollverlauf)
  const sketch = useTransform(p, [0.11, 0.21], [0, 1]);
  const sketchPanel = useTransform(p, [0.15, 0.25], [0, 1]);
  const dimH = useTransform(p, [0.17, 0.24], [0, 1]);
  const dimW = useTransform(p, [0.21, 0.28], [0, 1]);
  const bevel = useTransform(p, [0.25, 0.3], [0, 1]);
  const radius = useTransform(p, [0.28, 0.33], [0, 1]);
  const note = useTransform(p, [0.31, 0.37], [0, 1]);
  const hinge = useTransform(p, [0.35, 0.41], [0, 1]);
  const angle = useTransform(p, [0.39, 0.44], [0, 1]);
  const annoOut = useTransform(p, [0.44, 0.5], [1, 0]);

  // 3D-Ebene
  const canvasOpacity = useTransform(p, [0.46, 0.52, 0.85, 0.92], [0, 1, 1, 0]);

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

        {/* Foto-Bühne */}
        <motion.figure
          className="story__frame"
          ref={frameRef}
          style={{ opacity: frameOpacity, scale: frameScale }}
        >
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
            {/* Skizze der Türscheibe – an der fertigen Scheibe im Referenzfoto:
               rechte Kante an der Wand, Unterkante auf der Duschkante */}
            <motion.path
              className="anno-line anno-line--dashed"
              d="M 486 388 L 486 716 L 304 716 L 304 510 L 356 392 Z"
              style={{ pathLength: sketch, opacity: sketch }}
            />
            {/* Skizze des Seitenteils – steht im 90°-Winkel zur Tür und
               läuft nach hinten über Duschtasse und Sitzbank (Kantenansicht) */}
            <motion.path
              className="anno-line anno-line--dashed"
              d="M 304 716 L 196 716 L 196 575 L 213 512 L 258 394 L 304 510 Z"
              style={{ pathLength: sketchPanel, opacity: sketchPanel }}
            />
            {/* Höhe 1455 – an der Wandkante rechts */}
            <motion.g style={{ opacity: dimH }}>
              <motion.path
                className="anno-line"
                d="M 508 398 L 508 712 M 499 402 L 517 394 M 499 716 L 517 708"
                style={{ pathLength: dimH }}
              />
              <text className="anno-text" x="522" y="560" transform="rotate(-90 522 560)">
                1455
              </text>
            </motion.g>
            {/* Breite 753 – parallel zur Tassenvorderkante */}
            <motion.g style={{ opacity: dimW }}>
              <motion.path
                className="anno-line"
                d="M 302 736 L 488 736 M 302 726 L 302 746 M 488 726 L 488 746"
                style={{ pathLength: dimW }}
              />
              <text className="anno-text" x="370" y="728">
                753
              </text>
            </motion.g>
            {/* Eckschräge 569 – folgt dem Balken */}
            <motion.g style={{ opacity: bevel }}>
              <motion.path
                className="anno-line"
                d="M 306 508 L 356 394"
                style={{ pathLength: bevel }}
              />
              <text className="anno-text" x="360" y="374">
                Schräge · 569
              </text>
            </motion.g>
            {/* Radius */}
            <motion.g style={{ opacity: radius }}>
              <motion.path
                className="anno-line"
                d="M 457 403 q 16 -13 28 -5"
                style={{ pathLength: radius }}
              />
              <text className="anno-text" x="430" y="438">
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
              <text className="anno-text" x="328" y="492" transform="rotate(-2 328 492)">
                Aussparung 52 × 84
              </text>
              <motion.path
                className="anno-line"
                d="M 452 498 Q 492 565 484 650 M 484 650 l -13 -8 M 484 650 l 3 -15"
                style={{ pathLength: hinge }}
              />
            </motion.g>
            {/* Winkel – an der Stufenecke des Seitenteils */}
            <motion.g style={{ opacity: angle }}>
              <motion.path
                className="anno-line"
                d="M 196 640 q 20 -9 29 -25"
                style={{ pathLength: angle }}
              />
              <text className="anno-text" x="70" y="688" transform="rotate(2 70 688)">
                kein rechter Winkel!
              </text>
            </motion.g>
          </motion.svg>
        </motion.figure>

        {/* 3D-Glasscheiben */}
        <motion.div className="story__canvas" style={{ opacity: canvasOpacity }}>
          {showCanvas && (
            <Suspense fallback={null}>
              <GlassScene progressRef={sceneProgress} frameRef={frameRef} />
            </Suspense>
          )}
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
