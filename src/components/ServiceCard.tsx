import { Link } from 'react-router-dom';
import type { Service } from '../data/services';
import './ServiceCard.css';

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Link to={`/leistungen/${service.slug}`} className="service-card card" aria-label={`Mehr zu ${service.title}`}>
      <div className="service-card__media">
        <img
          src={service.hero}
          alt=""
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          width="800"
          height="600"
        />
      </div>
      <div className="service-card__body">
        <span className="service-card__index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__short">{service.short}</p>
        <span className="service-card__cta">
          Mehr erfahren
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
