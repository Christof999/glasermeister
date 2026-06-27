import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useT } from '../i18n';
import { useServices } from '../i18n/content/services';
import './Footer.css';

export function Footer() {
  const t = useT();
  const services = useServices();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <div className="site-footer__logo">
              <Logo className="site-footer__logo-svg" title="der-glasermeister" />
            </div>
            <p className="site-footer__claim">{t('footer.claim')}</p>
          </div>

          <div>
            <h3 className="site-footer__heading">{t('footer.services')}</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/leistungen/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-footer__heading">{t('footer.contact')}</h3>
            <address>
              <strong>der-glasermeister</strong><br />
              Patrick Stettner<br />
              Schulstr. 20<br />
              91732 Merkendorf<br />
              <a href="tel:+491752533137">0175 2533137</a><br />
              <a href="mailto:info@der-glasermeister.de">info@der-glasermeister.de</a>
            </address>
          </div>

          <div>
            <h3 className="site-footer__heading">{t('footer.legal')}</h3>
            <ul>
              <li><Link to="/impressum">{t('footer.imprint')}</Link></li>
              <li><Link to="/datenschutz">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} der-glasermeister · Patrick Stettner</p>
          <p>{t('footer.role')}</p>
          <p className="site-footer__credit">
            {t('footer.by')}{' '}
            <a href="https://soergel-design.de" target="_blank" rel="noopener noreferrer">
              Sørgel Design
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
