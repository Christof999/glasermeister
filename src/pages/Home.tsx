import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import { Seo, localBusinessJsonLd } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { ServiceCard } from '../components/ServiceCard';
import './Home.css';

export function Home() {
  return (
    <PageMotion>
      <Seo
        title="der-glasermeister – Patrick Stettner | Glaserei in Merkendorf"
        description="Glasermeister Patrick Stettner aus Merkendorf. Duschkabinen, Glastüren, Vordächer, Treppengeländer und Restaurierung antiker Fenster – aus Meisterhand."
        path="/"
        jsonLd={localBusinessJsonLd}
      />

      {/* Hero */}
      <section className="hero" aria-label="Einleitung">
        <div className="hero__media" aria-hidden="true">
          <img
            src="/images/IMG_0299.jpeg"
            alt=""
            loading="eager"
            decoding="async"
            width="1600"
            height="1200"
          />
          <div className="hero__veil" />
        </div>

        <div className="container hero__content">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Glasermeister · Merkendorf · seit Jahren
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Glas, das passt.<br />
            <span className="hero__accent">Aus Meisterhand.</span>
          </motion.h1>

          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Duschkabinen, Glastüren, Vordächer, Treppengeländer und Restaurierung antiker
            Fenster. Geplant, gefertigt und montiert von Patrick Stettner – millimetergenau.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link to="/kontakt" className="btn btn--primary">Kostenloses Angebot anfragen</Link>
            <Link to="/referenzen" className="btn btn--ghost">Referenzen ansehen</Link>
          </motion.div>

          <motion.div
            className="hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <strong>Meisterbetrieb</strong>
              <span>Glaserhandwerk</span>
            </div>
            <div>
              <strong>Individualfertigung</strong>
              <span>Maßgenau vor Ort</span>
            </div>
            <div>
              <strong>Region</strong>
              <span>Mittelfranken &amp; Umgebung</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section" aria-labelledby="leistungen-h">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Leistungen</span>
            <h2 id="leistungen-h">Was wir für Sie umsetzen.</h2>
            <p className="lead">
              Fünf Schwerpunkte – ein Anspruch: saubere Planung, hochwertiges Material,
              präzise Montage.
            </p>
          </Reveal>

          <div className="grid services-grid">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <ServiceCard service={s} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process" aria-labelledby="ablauf-h">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Ablauf</span>
            <h2 id="ablauf-h">Vom ersten Gespräch zur fertigen Montage.</h2>
          </Reveal>

          <div className="process__steps">
            {[
              { n: '01', t: 'Anfrage', d: 'Sie melden sich per Telefon, E-Mail oder Formular. Erste Einschätzung kostenlos.' },
              { n: '02', t: 'Aufmaß vor Ort', d: 'Millimetergenaues Aufmaß und persönliche Beratung – auch zu Glasarten und Beschlägen.' },
              { n: '03', t: 'Festes Angebot', d: 'Sie erhalten ein detailliertes, transparentes Angebot ohne versteckte Posten.' },
              { n: '04', t: 'Fertigung & Montage', d: 'Wir fertigen passgenau und montieren sauber – fertig zur Übergabe.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="process__step">
                  <span className="process__num">{step.n}</span>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" aria-labelledby="cta-h">
        <div className="container cta-section__inner">
          <Reveal>
            <h2 id="cta-h">Idee im Kopf? Lassen Sie uns sprechen.</h2>
            <p className="lead">
              Ein kurzer Anruf reicht meist, um zu sagen, ob und wie sich Ihre Vorstellung umsetzen lässt.
            </p>
            <div className="hero__actions">
              <a href="tel:+491752533137" className="btn btn--primary">0175 2533137</a>
              <Link to="/kontakt" className="btn btn--ghost">Anfrage schreiben</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
