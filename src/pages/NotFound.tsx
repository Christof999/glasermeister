import { Link } from 'react-router-dom';
import { Seo } from '../lib/seo';
import { PageMotion } from '../components/PageMotion';
import { useT } from '../i18n';

export function NotFound() {
  const t = useT();
  return (
    <PageMotion>
      <Seo title={t('nf.seoTitle')} description={t('nf.seoDesc')} path="/404" />
      <section className="section" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <span className="eyebrow">{t('nf.eyebrow')}</span>
          <h1>{t('nf.h1')}</h1>
          <p className="lead" style={{ margin: '0 auto 32px' }}>{t('nf.lead')}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn btn--primary">{t('nf.toHome')}</Link>
            <Link to="/kontakt" className="btn btn--ghost">{t('nf.toContact')}</Link>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
