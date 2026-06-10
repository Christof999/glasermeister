import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import { Seo, localBusinessWithReviewsJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { ScrollStory } from '../components/story/ScrollStory';
import { FloatingProjects } from '../components/FloatingProjects';
import { GlassCutGame } from '../components/GlassCutGame';
import { Reviews } from '../components/Reviews';
import './Home.css';

export function Home() {
  return (
    <PageMotion>
      <Seo
        title="der-glasermeister – Patrick Stettner | Glaserei in Merkendorf"
        description="Glasermeister Patrick Stettner aus Merkendorf. Maßgefertigte Duschverglasungen, Glastüren, Vordächer und mehr – vom Aufmaß bis zur Montage aus einer Hand."
        path="/"
        jsonLd={localBusinessWithReviewsJsonLd}
      />

      {/* Hero */}
      <section className="hero" aria-label="Einleitung">
        <div className="hero__media" aria-hidden="true">
          <img
            src="/images/schulstrasse/img_1681.jpg"
            alt=""
            loading="eager"
            decoding="async"
            width="1200"
            height="1600"
          />
        </div>

        <div className="container hero__content">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Glasermeister Patrick Stettner · Merkendorf
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Glas, auf den
            <br />
            <span className="hero__accent">Millimeter.</span>
          </motion.h1>

          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kein Winkel wie der andere, kein Glas von der Stange. Scrollen Sie
            durch ein echtes Projekt – von der Bleistiftzeichnung bis zur
            fertigen Dusche.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#projekt-schulstrasse" className="btn btn--primary">
              Die Geschichte eines Glases
            </a>
            <a href="tel:+491752533137" className="btn btn--ghost">
              0175 2533137
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero__hint"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="hero__hint-line" />
        </motion.div>
      </section>

      {/* Scroll-Story: Vom Aufmaß zum fertigen Glas */}
      <ScrollStory />

      {/* Projekte – schwebend im Raum */}
      <FloatingProjects />

      {/* Leistungen – bewusst knapp */}
      <section className="quiet-services" aria-labelledby="leistungen-h">
        <div className="container">
          <Reveal>
            <div className="quiet-services__row">
              <h2 id="leistungen-h">Außerdem aus Meisterhand</h2>
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
            <h2 id="cta-h">Ihr Projekt beginnt mit einem Maßband.</h2>
            <p className="lead">
              Ein kurzer Anruf reicht meist, um zu sagen, ob und wie sich Ihre
              Vorstellung umsetzen lässt – das Aufmaß übernehme ich.
            </p>
            <div className="hero__actions">
              <a href="tel:+491752533137" className="btn btn--primary">0175 2533137</a>
              <Link to="/kontakt" className="btn btn--ghost">Kontakt</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
