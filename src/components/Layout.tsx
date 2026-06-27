import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';
import { useT } from '../i18n';

export function Layout({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <>
      <a href="#main" className="skip-link">{t('skip.toContent')}</a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
