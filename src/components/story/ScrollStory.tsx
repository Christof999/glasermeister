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
  const draftRef = useRef<HTMLElement | null>(null);
  const sceneProgress = useRef(0);
  const reduced = useReducedMotion();
  const inView = useInView(containerRef, { margin: '400px 0px 400px 0px' });

  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(p, 'change', (v) => {
    sceneProgress.current = clamp01((v - 0.8) / (0.9 - 0.8));
  });

  // Intro
  const introOpacity = useTransform(p, [0, 0.07, 0.11], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.11], [0, -60]);

  // Foto-Ebene: Vorherbild startet groß, fährt zur Seite und kommt am Ende
  // wieder in die Mitte zurück; dabei fadet es zum echten Nachherbild.
  const photoOpacity = useTransform(p, [0.03, 0.09], [0, 1]);
  const photoScale = useTransform(p, [0.03, 0.13, 0.28, 0.88, 0.98], [1.06, 1, 0.48, 0.48, 1]);
  const photoX = useTransform(p, [0.13, 0.28, 0.88, 0.98], ['0vw', '-44vw', '-44vw', '0vw']);
  const photoY = useTransform(p, [0.13, 0.28, 0.88, 0.98], ['0vh', '-5vh', '-5vh', '0vh']);
  const vorherFilter = useTransform(
    p,
    [0.26, 0.36, 0.9, 0.98],
    ['brightness(1)', 'brightness(0.58)', 'brightness(0.58)', 'brightness(1)']
  );
  const nachherOpacity = useTransform(p, [0.9, 0.98], [0, 1]);
  const tagVorher = useTransform(p, [0.08, 0.12, 0.88, 0.92], [0, 1, 1, 0]);
  const tagNachher = useTransform(p, [0.92, 0.98], [0, 1]);

  // Schwarze Entwurfs-Ebene: Skizze und 3D-Glas entstehen unabhängig vom Foto.
  const draftOpacity = useTransform(p, [0.24, 0.3, 0.94, 0.98], [0, 1, 1, 0]);
  const sketch = useTransform(p, [0.3, 0.4], [0, 1]);
  const sketchPanel = useTransform(p, [0.36, 0.46], [0, 1]);
  const dimH = useTransform(p, [0.4, 0.48], [0, 1]);
  const dimW = useTransform(p, [0.44, 0.52], [0, 1]);
  const bevel = useTransform(p, [0.48, 0.54], [0, 1]);
  const radius = useTransform(p, [0.52, 0.58], [0, 1]);
  const note = useTransform(p, [0.56, 0.62], [0, 1]);
  const hinge = useTransform(p, [0.6, 0.68], [0, 1]);
  const angle = useTransform(p, [0.64, 0.72], [0, 1]);
  const annoOut = useTransform(p, [0.88, 0.94], [1, 0]);
  const sketchScale = useTransform(p, [0.7, 0.8], [1, 0.4]);
  const sketchX = useTransform(p, [0.7, 0.8], [0, 120]);
  const sketchY = useTransform(p, [0.7, 0.8], [0, -250]);

  // 3D-Scheiben kommen erst, wenn die Skizze aus der Mitte gewandert ist.
  const canvasOpacity = useTransform(p, [0.8, 0.86, 0.94, 0.98], [0, 1, 1, 0]);
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

        {/* Foto-Ebene: fährt zur Seite und kommt für den Nachher-Fade zurück */}
        <motion.div
          className="story__photo-stage"
          style={{ opacity: photoOpacity, x: photoX, y: photoY, scale: photoScale }}
        >
          <motion.figure className="story__frame story__frame--photo">
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
          </motion.figure>
        </motion.div>

        {/* Entwurfs-Ebene: Skizze und 3D-Glas auf schwarzem Hintergrund */}
        <motion.div className="story__draft-stage" style={{ opacity: draftOpacity }}>
          <motion.figure className="story__frame story__frame--draft" ref={draftRef}>
            {/* Bleistift-Aufmaß */}
            <motion.svg
              className="story__anno"
              viewBox="0 0 600 800"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              style={{ opacity: annoOut }}
            >
              <motion.g
                className="story__anno-drawing"
                style={{ x: sketchX, y: sketchY, scale: sketchScale }}
              >
                {/* Frontale Aufmaß-Skizze: zwei getrennte Zuschnitte. */}
                <motion.path
                  className="anno-line anno-line--dashed"
                  d="M 335 685 L 515 685 L 515 595 L 503 595 L 503 563 L 515 563 L 515 260 L 503 260 L 503 228 L 515 228 L 515 135 L 379 135 L 335 215 Z"
                  style={{ pathLength: sketch, opacity: sketch }}
                />
                <motion.path
                  className="anno-line anno-line--dashed"
                  d="M 245 640 L 325 640 L 325 250 L 270 250 L 115 454 L 119 518 L 245 529 Z"
                  style={{ pathLength: sketchPanel, opacity: sketchPanel }}
                />
                {/* Höhe 1455 – an der großen Tür */}
                <motion.g style={{ opacity: dimH }}>
                  <motion.path
                    className="anno-line"
                    d="M 548 140 L 548 680 M 538 144 L 558 136 M 538 684 L 558 676"
                    style={{ pathLength: dimH }}
                  />
                  <text className="anno-text" x="566" y="420" transform="rotate(-90 566 420)">
                    1455
                  </text>
                </motion.g>
                {/* Breite 753 – frontal unter der Tür */}
                <motion.g style={{ opacity: dimW }}>
                  <motion.path
                    className="anno-line"
                    d="M 335 718 L 515 718 M 335 706 L 335 730 M 515 706 L 515 730"
                    style={{ pathLength: dimW }}
                  />
                  <text className="anno-text" x="410" y="710">
                    753
                  </text>
                </motion.g>
                {/* Eckschräge 569 */}
                <motion.g style={{ opacity: bevel }}>
                  <motion.path
                    className="anno-line"
                    d="M 335 215 L 379 135"
                    style={{ pathLength: bevel }}
                  />
                  <text className="anno-text" x="374" y="108">
                    Schräge · 569
                  </text>
                </motion.g>
                {/* Radius */}
                <motion.g style={{ opacity: radius }}>
                  <motion.path
                    className="anno-line"
                    d="M 492 152 q 20 -16 34 -6"
                    style={{ pathLength: radius }}
                  />
                  <text className="anno-text" x="460" y="190">
                    R8
                  </text>
                </motion.g>
                {/* Materialnotiz – links frei platziert, damit oben nichts kollidiert. */}
                <motion.g style={{ opacity: note }} transform="rotate(-2 86 118)">
                  <text className="anno-text anno-text--big" x="86" y="118">
                    Parsol grau
                  </text>
                  <text className="anno-text anno-text--big" x="86" y="158">
                    8 mm ESG
                  </text>
                  <motion.path
                    className="anno-line"
                    d="M 84 172 q 44 8 88 2 q 32 -5 56 3"
                    style={{ pathLength: note }}
                  />
                </motion.g>
                {/* Bandaussparung – Pfeil zur Schlagkante an der Wand */}
                <motion.g style={{ opacity: hinge }}>
                  <text className="anno-text" x="330" y="430" transform="rotate(-2 330 430)">
                    Aussparung 52 × 84
                  </text>
                  <motion.path
                    className="anno-line"
                    d="M 446 438 Q 520 500 520 590 M 520 590 l -12 -10 M 520 590 l 5 -15"
                    style={{ pathLength: hinge }}
                  />
                </motion.g>
                {/* Winkel – am kleineren Seitenteil */}
                <motion.g style={{ opacity: angle }}>
                  <motion.path
                    className="anno-line"
                    d="M 112 510 q 22 -12 34 -32"
                    style={{ pathLength: angle }}
                  />
                  <text className="anno-text" x="54" y="690" transform="rotate(2 54 690)">
                    kein rechter Winkel!
                  </text>
                </motion.g>
              </motion.g>
            </motion.svg>
          </motion.figure>

          <motion.div className="story__canvas" style={{ opacity: canvasOpacity }}>
            {showCanvas && (
              <Suspense fallback={null}>
                <GlassScene progressRef={sceneProgress} frameRef={draftRef} />
              </Suspense>
            )}
          </motion.div>
        </motion.div>

        {/* Kapitel */}
        <div className="story__captions">
          <Caption progress={p} range={[0.09, 0.24]} index="01" title="Vorher">
            Ein Bad unterm Dach, fertig gefliest – nur die Dusche ist noch offen.
            Der Balken von 1780 bleibt, das Glas muss sich fügen.
          </Caption>
          <Caption progress={p} range={[0.26, 0.55]} index="02" title="Das Aufmaß">
            Jede Kante wird vor Ort auf den Millimeter aufgenommen und in die
            Zeichnung übertragen – hier ist kein Winkel ein rechter.
          </Caption>
          <Caption progress={p} range={[0.74, 0.9]} index="03" title="Das Glas">
            Türblatt und Seitenteil aus grau getöntem Sicherheitsglas, Kanten
            feingeschliffen. Gefertigt nach Zeichnung – passend beim ersten Einsetzen.
          </Caption>
          <Caption progress={p} range={[0.9, 1]} index="04" title="Nachher">
            Als wäre es immer da gewesen. Maßarbeit sieht man ihr nicht an –
            genau das ist der Punkt.
          </Caption>
        </div>
      </div>
    </section>
  );
}
