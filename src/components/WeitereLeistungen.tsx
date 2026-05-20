import { Link } from 'react-router-dom';
import { specials } from '../data/specials';
import { Reveal } from './PageMotion';
import './WeitereLeistungen.css';

export function WeitereLeistungen() {
  return (
    <section className="section weitere" aria-labelledby="weitere-h">
      <div className="container">
        <div className="weitere-grid">
          <Reveal>
            <div>
              <span className="eyebrow">Spezialarbeiten</span>
              <h2 id="weitere-h">Und alles dazwischen.</h2>
              <p className="lead">
                Glas ist ein Werkstoff mit unzähligen Facetten. Neben den großen
                Gewerken fertigen wir die kleinen, oft entscheidenden Details –
                und nehmen besonders gern Sonderkonstruktionen an.
              </p>

              <p className="weitere-callout">
                <strong>Sonderkonstruktionen erwünscht.</strong> Wenn Sie etwas
                Besonderes brauchen: fragen Sie uns. Wir finden eine Lösung.
              </p>

              <Link to="/kontakt" className="btn btn--primary">
                Sonderanfrage senden
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="weitere-list" aria-label="Weitere Leistungen">
              {specials.map((item) => (
                <li key={item.label}>
                  <div className="weitere-item">
                    <div className="weitere-item__dot" aria-hidden="true" />
                    <div>
                      <strong>{item.label}</strong>
                      {item.description && <span>{item.description}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
