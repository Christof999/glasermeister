import { Seo, localBusinessJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { ContactForm } from '../components/ContactForm';
import './Kontakt.css';

export function Kontakt() {
  return (
    <PageMotion>
      <Seo
        title="Kontakt – der-glasermeister Merkendorf"
        description="Schreiben Sie uns oder rufen Sie direkt an: 0175 2533137. Glasermeister Patrick Stettner aus Merkendorf – Anfragen kostenlos."
        path="/kontakt"
        jsonLd={localBusinessJsonLd}
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Kontakt</span>
            <h1>Lassen Sie uns über Ihr Projekt sprechen.</h1>
            <p className="lead">
              Beschreiben Sie Ihr Vorhaben in wenigen Sätzen – ich melde mich
              schnellstmöglich für ein unverbindliches Aufmaß und Angebot.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container kontakt-grid">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="kontakt-info">
              <h2>Direkt erreichen</h2>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">Telefon</span>
                <a href="tel:+491752533137" className="kontakt-info__value">0175 2533137</a>
              </div>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">E-Mail</span>
                <a href="mailto:info@der-glasermeister.de" className="kontakt-info__value">
                  info@der-glasermeister.de
                </a>
              </div>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">Werkstatt &amp; Anschrift</span>
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
                  Auf OpenStreetMap ansehen
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">Erreichbarkeit</span>
                <p className="kontakt-info__value">
                  Mo – Fr · nach Terminvereinbarung<br />
                  <span className="kontakt-info__hint">
                    Tagsüber bin ich oft auf der Baustelle. Bitte hinterlassen Sie eine
                    Nachricht – ich rufe garantiert zurück.
                  </span>
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
