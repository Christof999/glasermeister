import { Seo, localBusinessJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import './Kontakt.css';

export function Kontakt() {
  return (
    <PageMotion>
      <Seo
        title="Kontakt – der-glasermeister Merkendorf"
        description="Rufen Sie direkt an: 0175 2533137 – oder schreiben Sie eine E-Mail. Glasermeister Patrick Stettner aus Merkendorf, Anfragen kostenlos."
        path="/kontakt"
        jsonLd={localBusinessJsonLd}
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Kontakt</span>
            <h1>Ein Anruf genügt.</h1>
            <p className="lead">
              Am schnellsten klären wir Ihr Vorhaben im Gespräch – kostenlos und
              unverbindlich. Tagsüber bin ich oft auf der Baustelle: Hinterlassen
              Sie eine Nachricht, ich rufe garantiert zurück.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container kontakt-grid">
          <Reveal>
            <div className="kontakt-direct">
              <a href="tel:+491752533137" className="kontakt-direct__card">
                <span className="kontakt-info__label">Telefon</span>
                <strong>0175 2533137</strong>
                <span className="kontakt-direct__hint">Mo – Fr · nach Terminvereinbarung</span>
              </a>
              <a href="mailto:info@der-glasermeister.de" className="kontakt-direct__card">
                <span className="kontakt-info__label">E-Mail</span>
                <strong>info@der-glasermeister.de</strong>
                <span className="kontakt-direct__hint">
                  Gern mit Fotos und groben Maßen – das beschleunigt das Angebot.
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="kontakt-info">
              <h2>Werkstatt &amp; Anschrift</h2>

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
                  Auf OpenStreetMap ansehen
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="kontakt-info__block">
                <span className="kontakt-info__label">Einzugsgebiet</span>
                <p className="kontakt-info__value">
                  Merkendorf, Ansbach, Gunzenhausen, Weißenburg –<br />
                  Mittelfranken &amp; Umgebung.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
