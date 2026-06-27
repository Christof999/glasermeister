import { Link } from 'react-router-dom';
import { Seo, localBusinessWithReviewsJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { LaserIntro } from '../components/intro/LaserIntro';
import { ScrollStory } from '../components/story/ScrollStory';
import { WorkSphere } from '../components/sphere/WorkSphere';
import { GlassCutGame } from '../components/GlassCutGame';
import { Reviews } from '../components/Reviews';
import { useT } from '../i18n';
import { useServices } from '../i18n/content/services';
import './Home.css';

export function Home() {
  const t = useT();
  const services = useServices();
  return (
    <PageMotion>
      <Seo
        title="der-glasermeister – Patrick Stettner | Glaserei in Merkendorf"
        description="Glasermeister Patrick Stettner aus Merkendorf. Maßgefertigte Duschverglasungen, Glastüren, Vordächer und mehr – vom Aufmaß bis zur Montage aus einer Hand."
        path="/"
        jsonLd={localBusinessWithReviewsJsonLd}
      />

      {/* Startsequenz: Logo wird in Glas gelasert */}
      <LaserIntro />

      {/* Scroll-Story: Vom Aufmaß zum fertigen Glas */}
      <ScrollStory />

      {/* Projekte – begehbare Sphäre mit Tunnel-Transition */}
      <WorkSphere />

      {/* Leistungen – bewusst knapp */}
      <section className="quiet-services" aria-labelledby="leistungen-h">
        <div className="container">
          <Reveal>
            <div className="quiet-services__row">
              <h2 id="leistungen-h">{t('home.servicesHeading')}</h2>
              <ul className="quiet-services__list">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/leistungen/${s.slug}`} className="quiet-services__pill">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bewertungen */}
      <Reviews />

      {/* Glasschnitt-Minispiel */}
      <GlassCutGame />

      {/* CTA */}
      <section className="section cta-section" aria-labelledby="cta-h">
        <div className="container cta-section__inner">
          <Reveal>
            <h2 id="cta-h">{t('cta.heading')}</h2>
            <p className="lead">{t('cta.lead')}</p>
            <div className="hero__actions">
              <a href="tel:+491752533137" className="btn btn--primary">0175 2533137</a>
              <Link to="/kontakt" className="btn btn--ghost">{t('nav.contact')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
