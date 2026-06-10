import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Service } from './pages/Service';
import { Kontakt } from './pages/Kontakt';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';
import { NotFound } from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Ziel kann erst nach dem Seitenwechsel im DOM sein
      const id = hash.slice(1);
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <ScrollManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/leistungen/:slug" element={<Service />} />
          <Route path="/referenzen" element={<Navigate to="/#projekte" replace />} />
          <Route path="/ueber-uns" element={<Navigate to="/" replace />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
