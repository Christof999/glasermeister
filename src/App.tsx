import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Service } from './pages/Service';
import { Referenzen } from './pages/Referenzen';
import { UeberUns } from './pages/UeberUns';
import { Kontakt } from './pages/Kontakt';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/leistungen/:slug" element={<Service />} />
          <Route path="/referenzen" element={<Referenzen />} />
          <Route path="/ueber-uns" element={<UeberUns />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
