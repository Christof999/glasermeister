import { reviews, reviewStats } from '../data/reviews';
import { Reveal } from './PageMotion';
import './Reviews.css';

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.95 4.27 4.65.55-3.45 3.16.94 4.6L8 11.78l-4.09 2.3.94-4.6L1.4 6.32l4.65-.55L8 1.5z"
            fill={i < value ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  const featured = reviews.slice(0, 6);

  return (
    <section className="section reviews-section" aria-labelledby="reviews-h">
      <div className="container">
        <Reveal>
          <div className="reviews-header">
            <div>
              <span className="eyebrow">Bewertungen</span>
              <h2 id="reviews-h">Was Kundinnen und Kunden sagen.</h2>
            </div>
            <div className="reviews-summary" aria-label="Durchschnittsbewertung">
              <div className="reviews-summary__value">
                {reviewStats.ratingValue.toFixed(1)}
              </div>
              <div>
                <Stars value={5} />
                <p className="reviews-summary__count">
                  {reviewStats.reviewCount} Bewertungen auf Google
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="reviews-grid">
          {featured.map((r, i) => (
            <Reveal key={r.author} delay={(i % 3) * 0.06}>
              <article className="review-card">
                <Stars value={r.rating} />
                <blockquote>„{r.text}"</blockquote>
                <footer>
                  <cite>{r.author}</cite>
                  <span className="review-card__when">{r.when}</span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="reviews-footer">
            <a
              href="https://www.google.com/search?q=der-glasermeister+merkendorf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              Alle Bewertungen auf Google ansehen
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
