import { Link } from 'react-router-dom';
import { Seo } from '../lib/seo';
import { PageMotion } from '../components/PageMotion';

export function NotFound() {
  return (
    <PageMotion>
      <Seo title="Seite nicht gefunden" description="Diese Seite existiert nicht." path="/404" />
      <section className="section" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <span className="eyebrow">Fehler 404</span>
          <h1>Seite nicht gefunden.</h1>
          <p className="lead" style={{ margin: '0 auto 32px' }}>
            Diese Adresse existiert nicht (mehr). Vielleicht hilft Ihnen einer der Links weiter.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn--primary">Zur Startseite</Link>
            <Link to="/kontakt" className="btn btn--ghost">Kontakt aufnehmen</Link>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
