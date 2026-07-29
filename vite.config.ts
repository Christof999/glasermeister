import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Legt neben index.html eine identische 404.html im Build ab. Hoster, die keine
 * SPA-Rewrite-Regel kennen (GitHub Pages, manche Webspaces), liefern bei
 * unbekannten Pfaden diese Datei aus – die Route wird dann vom Router im
 * Browser aufgelöst statt eine Fehlerseite zu zeigen.
 */
function spaFallbackHtml(): Plugin {
  return {
    name: 'spa-fallback-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (index && index.type === 'asset') {
        this.emitFile({ type: 'asset', fileName: '404.html', source: index.source });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallbackHtml()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
  },
});
