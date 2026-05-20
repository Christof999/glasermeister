import { Link } from 'react-router-dom';
import { Seo } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import './UeberUns.css';

export function UeberUns() {
  return (
    <PageMotion>
      <Seo
        title="Über uns – Patrick Stettner | Glasermeister aus Merkendorf"
        description="Patrick Stettner ist Glasermeister aus Merkendorf. Lernen Sie den Menschen hinter den Glasarbeiten kennen – Handwerk mit Augenmaß und Anspruch."
        path="/ueber-uns"
      />

      <section className="section section--tight page-head">
        <div className="container ueber-grid">
          <Reveal>
            <div>
              <span className="eyebrow">Über uns</span>
              <h1>Handwerk, das man sieht.</h1>
              <p className="lead">
                der-glasermeister ist Patrick Stettner – Glasermeister aus Merkendorf in
                Mittelfranken. Hinter jedem Auftrag steht der gleiche Anspruch: präzise
                planen, sauber arbeiten, ehrlich beraten.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="ueber-figure">
              <img src="/images/IMG_0299.jpeg" alt="Patrick Stettner auf einem fertig montierten Vordach" loading="eager" decoding="async" />
              <figcaption>Patrick Stettner – Glasermeister</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container ueber-content">
          <Reveal>
            <h2>Warum ein Meisterbetrieb?</h2>
            <p>
              Glas verzeiht keine Ungenauigkeit. Eine Duschkabine, die nicht millimetergenau
              sitzt, ist undicht. Ein Vordach, das nicht statisch geplant ist, wird zur
              Gefahr. Ein Treppengeländer, das nicht nach DIN ausgelegt ist, hält dem
              Alltag nicht stand.
            </p>
            <p>
              Als Meisterbetrieb stehen wir für genau diese Sorgfalt – von der ersten
              Skizze über das Aufmaß vor Ort bis zur sauberen Montage.
            </p>

            <h2>Was uns ausmacht</h2>
            <ul className="ueber-points">
              <li>
                <strong>Persönlich.</strong> Sie sprechen mit dem Meister, nicht mit
                wechselnden Sachbearbeitern.
              </li>
              <li>
                <strong>Maßgefertigt.</strong> Wir bauen kein Standardprogramm ab –
                jede Lösung entsteht für Ihren Raum.
              </li>
              <li>
                <strong>Transparent.</strong> Klare Angebote, ehrliche Einschätzungen,
                keine versteckten Posten.
              </li>
              <li>
                <strong>Verlässlich.</strong> Termin- und Preiszusagen, die halten.
              </li>
            </ul>

            <h2>Region</h2>
            <p>
              Schwerpunkt ist Mittelfranken und Umgebung – Merkendorf, Ansbach, Gunzenhausen,
              Weißenburg, Roth und der gesamte Landkreis. Größere Vorhaben setzen wir auch
              überregional um.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="ueber-cta">
              <h3>Lassen Sie uns über Ihr Projekt sprechen.</h3>
              <div className="hero__actions">
                <Link to="/kontakt" className="btn btn--primary">Anfrage schreiben</Link>
                <a href="tel:+491752533137" className="btn btn--ghost">0175 2533137</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
