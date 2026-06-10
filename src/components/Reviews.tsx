import { motion, useReducedMotion } from 'framer-motion';
import { reviews, reviewStats, type Review } from '../data/reviews';
import { Reveal } from './PageMotion';
import './Reviews.css';

function Stars({ value, animate = false }: { value: number; animate?: boolean }) {
  return (
    <span className="stars" aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
          initial={animate ? { opacity: 0, scale: 0.4 } : false}
          whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M8 1.5l1.95 4.27 4.65.55-3.45 3.16.94 4.6L8 11.78l-4.09 2.3.94-4.6L1.4 6.32l4.65-.55L8 1.5z"
            fill={i < value ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg className="review-card__g" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <header className="review-card__head">
        <span className="review-card__avatar" aria-hidden="true">
          {review.author.charAt(0)}
        </span>
        <div className="review-card__who">
          <cite>{review.author}</cite>
          <span className="review-card__when">{review.when}</span>
        </div>
        <GoogleG />
      </header>
      <Stars value={review.rating} />
      <blockquote>„{review.text}"</blockquote>
    </article>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: Review[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''}`}>
      <div className="marquee__track" style={{ animationDuration: `${duration}s` }}>
        <div className="marquee__half">
          {items.map((r) => (
            <ReviewCard key={r.author} review={r} />
          ))}
        </div>
        {/* Identisches Duplikat für die nahtlose Endlosschleife */}
        <div className="marquee__half" aria-hidden="true">
          {items.map((r) => (
            <ReviewCard key={`dup-${r.author}`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const reduced = useReducedMotion();
  const rowA = reviews.filter((_, i) => i % 2 === 0);
  const rowB = reviews.filter((_, i) => i % 2 === 1);

  return (
    <section className="section reviews-section" aria-labelledby="reviews-h">
      <div className="container">
        <Reveal>
          <div className="reviews-header">
            <div className="reviews-score" aria-label={`Durchschnitt ${reviewStats.ratingValue.toFixed(1)} von 5 Sternen`}>
              <span className="reviews-score__value">
                {reviewStats.ratingValue.toFixed(1).replace('.', ',')}
              </span>
              <div className="reviews-score__meta">
                <Stars value={5} animate />
                <span>{reviewStats.reviewCount} Bewertungen auf Google</span>
              </div>
            </div>
            <div className="reviews-header__text">
              <span className="eyebrow">Bewertungen</span>
              <h2 id="reviews-h">Was Kundinnen und Kunden sagen.</h2>
              <a
                href="https://www.google.com/search?q=der-glasermeister+merkendorf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost reviews-header__btn"
              >
                Alle Bewertungen ansehen
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {reduced ? (
        <div className="container reviews-static">
          {reviews.slice(0, 6).map((r) => (
            <ReviewCard key={r.author} review={r} />
          ))}
        </div>
      ) : (
        <div className="reviews-marquees">
          <MarqueeRow items={rowA} duration={56} />
          <MarqueeRow items={rowB} duration={44} reverse />
        </div>
      )}
    </section>
  );
}
