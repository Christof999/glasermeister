import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Seo } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { Lightbox } from '../components/Lightbox';
import { Picture } from '../components/Picture';
import { useT } from '../i18n';
import { useService, useServices } from '../i18n/content/services';
import './Service.css';

export function Service() {
  const { slug } = useParams<{ slug: string }>();
  const service = useService(slug);
  const allServices = useServices();
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const t = useT();

  if (!service) return <Navigate to="/" replace />;

  const otherServices = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);
  const alts = service.gallery.map((_, i) => t('srv.exampleAlt', { title: service.title, i: i + 1 }));

  return (
    <PageMotion>
      <Seo
        title={`${service.title} – Glasermeister Patrick Stettner`}
        description={service.intro}
        path={`/leistungen/${service.slug}`}
        image={service.hero}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.intro,
          provider: {
            '@type': 'LocalBusiness',
            name: 'der-glasermeister',
            telephone: '+49 175 2533137',
          },
          areaServed: 'Bayern',
        }}
      />

      <section className="service-hero" aria-label={service.title}>
        <div className="service-hero__media" aria-hidden="true">
          <Picture src={service.hero} alt="" loading="eager" fetchPriority="high" decoding="async" width="1600" height="1000" />
          <div className="service-hero__veil" />
        </div>
        <div className="container service-hero__content">
          <Link to="/" className="service-hero__back">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('srv.back')}
          </Link>
          <span className="eyebrow">{t('srv.eyebrow')}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-grid">
          <Reveal>
            <div className="service-text">
              {service.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="service-bullets" aria-label={t('srv.bullets')}>
              <h2>{t('srv.bullets')}</h2>
              <ul>
                {service.bullets.map((b) => (
                  <li key={b}>
                    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M4 10l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/kontakt" className="btn btn--primary service-bullets__cta">
                {t('srv.cta')}
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      {service.gallery.length > 1 && (
        <section className="section section--tight" aria-labelledby="srv-gallery">
          <div className="container">
            <Reveal>
              <span className="eyebrow">{t('srv.examplesEyebrow')}</span>
              <h2 id="srv-gallery">{t('srv.examplesHeading')}</h2>
            </Reveal>
            <div className="service-gallery">
              {service.gallery.map((src, i) => (
                <Reveal key={src} delay={i * 0.05}>
                  <button
                    type="button"
                    className="service-gallery__item"
                    onClick={() => setLbIndex(i)}
                    aria-label={t('srv.enlargeAria', { i: i + 1 })}
                  >
                    <Picture src={src} alt={alts[i]} loading="lazy" decoding="async" />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section other-services" aria-labelledby="more-h">
        <div className="container">
          <Reveal>
            <h2 id="more-h">{t('srv.more')}</h2>
          </Reveal>
          <div className="grid other-services__grid">
            {otherServices.map((s) => (
              <Reveal key={s.slug}>
                <Link to={`/leistungen/${s.slug}`} className="other-services__card card">
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <span className="service-card__cta">
                    {t('srv.learnMore')}
                    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={service.gallery}
        alts={alts}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onPrev={() =>
          setLbIndex((i) => (i === null ? null : (i - 1 + service.gallery.length) % service.gallery.length))
        }
        onNext={() =>
          setLbIndex((i) => (i === null ? null : (i + 1) % service.gallery.length))
        }
      />
    </PageMotion>
  );
}
