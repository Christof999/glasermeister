import { Seo } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import './Legal.css';

export function Impressum() {
  return (
    <PageMotion>
      <Seo
        title="Impressum"
        description="Impressum und Anbieterkennzeichnung gemäß § 5 DDG."
        path="/impressum"
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Rechtliches</span>
            <h1>Impressum</h1>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container legal">
          <Reveal>
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>
              <strong>der-glasermeister</strong><br />
              Einzelunternehmen Patrick Stettner<br />
              Schulstr. 20<br />
              91732 Merkendorf<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: <a href="tel:+491752533137">0175 2533137</a><br />
              E-Mail: <a href="mailto:info@der-glasermeister.de">info@der-glasermeister.de</a><br />
              Internet: <a href="https://www.der-glasermeister.de">www.der-glasermeister.de</a>
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              <strong>DE357501503</strong>
            </p>

            <h2>Steuernummer</h2>
            <p>203/277/80574</p>

            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Berufsbezeichnung: Glasermeister<br />
              Verliehen in: Bundesrepublik Deutschland<br />
              Zuständige Kammer: Handwerkskammer für Mittelfranken
            </p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Patrick Stettner<br />
              Schulstr. 20, 91732 Merkendorf
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
              <br />
              Unsere E-Mail-Adresse finden Sie oben.
            </p>

            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
              DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
              forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
              wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte
              auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
              stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
              Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
              bzw. Erstellers.
            </p>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
