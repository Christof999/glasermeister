import { Seo } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import './Legal.css';

export function Datenschutz() {
  return (
    <PageMotion>
      <Seo
        title="Datenschutzerklärung"
        description="Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO bei der-glasermeister."
        path="/datenschutz"
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Rechtliches</span>
            <h1>Datenschutzerklärung</h1>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container legal">
          <Reveal>
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):<br /><br />
              <strong>der-glasermeister</strong><br />
              Einzelunternehmen Patrick Stettner<br />
              Schulstr. 20, 91732 Merkendorf<br />
              Telefon: <a href="tel:+491752533137">0175 2533137</a><br />
              E-Mail: <a href="mailto:info@der-glasermeister.de">info@der-glasermeister.de</a>
            </p>

            <h2>2. Allgemeine Hinweise</h2>
            <p>
              Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der
              Verarbeitung personenbezogener Daten auf unserer Website auf. Wir behandeln
              Ihre Daten vertraulich und entsprechend den gesetzlichen Vorgaben (DSGVO, BDSG).
            </p>

            <h2>3. Hosting und Server-Logfiles</h2>
            <p>
              Beim Aufruf dieser Website werden durch den Hosting-Provider in sogenannten
              Server-Logfiles automatisch Informationen erfasst, die Ihr Browser übermittelt.
              Dies sind:
            </p>
            <ul>
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse (gekürzt bzw. anonymisiert)</li>
            </ul>
            <p>
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
              technisch fehlerfreien Darstellung und Sicherheit der Website).
            </p>

            <h2>4. Cookies</h2>
            <p>
              <strong>Diese Website verwendet keine Cookies und kein Tracking.</strong>{' '}
              Lediglich ein technisch notwendiger Eintrag im Local Storage Ihres Browsers
              speichert, ob Sie den Datenschutzhinweis bestätigt haben. Dieser Eintrag
              enthält keine personenbezogenen Daten und wird nicht an Dritte übermittelt.
            </p>

            <h2>5. Schriftarten (lokal eingebunden)</h2>
            <p>
              Wir verwenden die Schriftart „Inter". Sie wird ausschließlich lokal von unserem
              Server geladen. Es findet <strong>keine Verbindung zu Google Fonts oder
              anderen externen Schriftanbietern</strong> statt.
            </p>

            <h2>6. Kontaktformular und Anfragen per E-Mail</h2>
            <p>
              Wenn Sie uns per Kontaktformular, E-Mail oder Telefon Anfragen zukommen
              lassen, werden Ihre Angaben inklusive der Kontaktdaten zur Bearbeitung der
              Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern
              Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur
              Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen
              Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der
              effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
              DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
            <p>
              Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis
              Sie uns zur Löschung auffordern, Ihre Einwilligung widerrufen oder der Zweck
              für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung).
              Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen –
              bleiben unberührt.
            </p>

            <h2>7. Ihre Rechte als Betroffener</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul>
              <li>auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO),</li>
              <li>auf Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
              <li>auf Löschung Ihrer Daten (Art. 17 DSGVO),</li>
              <li>auf Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
              <li>auf Datenübertragbarkeit (Art. 20 DSGVO),</li>
              <li>auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO),</li>
              <li>auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO),</li>
              <li>auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO).</li>
            </ul>
            <p>
              Zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht
              (BayLDA),{' '}
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer">
                www.lda.bayern.de
              </a>.
            </p>

            <h2>8. SSL-/TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine
              verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
              Browsers von „http://" auf „https://" wechselt.
            </p>

            <h2>9. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung
              unserer Website oder aufgrund geänderter gesetzlicher Vorgaben kann eine
              Anpassung notwendig werden. Die jeweils aktuelle Fassung können Sie jederzeit
              auf dieser Seite abrufen.
            </p>
          </Reveal>
        </div>
      </section>
    </PageMotion>
  );
}
