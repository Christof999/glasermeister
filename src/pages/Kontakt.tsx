import { Seo, localBusinessJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { useT } from '../i18n';
import './Kontakt.css';

export function Kontakt() {
  const t = useT();
  return (
    <PageMotion>
      <Seo
        title={t('contact.seoTitle')}
        description={t('contact.seoDesc')}
        path="/kontakt"
        jsonLd={localBusinessJsonLd}
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h1>{t('contact.h1')}</h1>
            <p className="lead">{t('contact.lead')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container kontakt-grid">
          <Reveal>
            <div className="kontakt-direct">
              <a href="tel:+491752533137" className="kontakt-direct__card">
                <span className="kontakt-info__label">{t('contact.phoneLabel')}</span>
                <strong>0175 2533137</strong>
                <span className="kontakt-direct__hint">{t('contact.phoneHint')}</span>
              </a>
              <a href="mailto:info@der-glasermeister.de" className="kontakt-direct__card">
                <span className="kontakt-info__label">{t('contact.emailLabel')}</span>
                <strong>info@der-glasermeister.de</strong>
                <span className="kontakt-direct__hint">{t('contact.emailHint')}</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="kontakt-info">
              <h2>{t('contact.addressHeading')}</h2>

              <div className="kontakt-info__block">
                <address className="kontakt-info__value">
                  der-glasermeister<br />
                  Patrick Stettner<br />
                  Schulstr. 20<br />
                  91732 Merkendorf
                </address>
                <a
                  href="https://www.openstreetmap.org/?mlat=49.20&mlon=10.69#map=14/49.20/10.69&query=Schulstr.+20+91732+Merkendorf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kontakt-info__map"
                >
                  {t('contact.mapLink')}
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">{t('contact.areaLabel')}</span>
                <p className="kontakt-info__value">{t('contact.areaText')}</p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
