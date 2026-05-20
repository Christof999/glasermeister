import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Zum Hauptinhalt springen</a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
