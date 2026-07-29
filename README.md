# der-glasermeister

Website für **der-glasermeister – Patrick Stettner**, Merkendorf.
Gebaut mit React + Vite + TypeScript + Framer Motion + React Router.

## Eigenschaften

- **Mobile-first**, responsiv ab 320 px, Touch-Targets ≥ 44 × 44 px.
- **Barrierefrei (WCAG AA)** – semantisches HTML, sichtbarer Fokus, Skip-Link,
  Reduced-Motion respektiert, Kontrast ≥ 4.5:1, Lightbox per Tastatur bedienbar.
- **DSGVO-konform** – keine Cookies, kein Tracking, keine externen Fonts/Maps,
  Kontaktformular mit Einwilligung + Honeypot, vollständiges Impressum &
  Datenschutzhinweis.
- **SEO** – Per-Page Meta-Tags, Open Graph, Twitter Cards, JSON-LD
  (`LocalBusiness` / `Service`), `sitemap.xml`, `robots.txt`, semantische
  Überschriftenstruktur, sprechende URLs.
- **Performance** – `loading="lazy"`, `decoding="async"`, Code-Splitting via
  React-Router, keine externen Requests zur Laufzeit.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal testen
```

## Kontaktformular

Standardmäßig öffnet das Formular den Mail-Client des Besuchers (`mailto:`).
Wer es serverlos versenden möchte, kann **EmailJS** anbinden:

1. Konto auf [emailjs.com](https://www.emailjs.com/) anlegen, Service + Template erstellen.
2. `.env.example` nach `.env` kopieren und die drei Variablen ausfüllen.
3. Build neu deployen – das Formular sendet dann direkt aus dem Browser.

Wird keine Variable gesetzt, bleibt der `mailto:`-Fallback aktiv. Das ist
DSGVO-rechtlich unbedenklich, weil dabei kein externer Anbieter involviert ist.

## Bilder

Die Originalbilder liegen unter `public/images/`. Wenn der Kunde neue Fotos
liefert, einfach dort ablegen und in `src/data/services.ts` referenzieren.

## Deployment

Statisches Build – läuft auf jedem Webspace, Netlify, Vercel, Cloudflare Pages, …
Wichtige Hinweise:

- **SPA-Routing**: Der Server muss unbekannte Pfade auf `/index.html` ausliefern,
  sonst antwortet er auf Direktaufrufe wie `/leistungen/glastueren` mit 404
  (innerhalb der Seite funktionieren die Links trotzdem, weil dort der Router
  im Browser übernimmt). Im Build ist alles vorbereitet:

  | Hoster | Datei im Build | Hinweis |
  | --- | --- | --- |
  | Netlify, Cloudflare Pages | `_redirects` | greift automatisch |
  | Vercel | `vercel.json` (Repo-Root) | greift automatisch |
  | Apache-Webspace (IONOS, Strato, All-Inkl …) | `.htaccess` | **muss mit hochgeladen werden** |
  | GitHub Pages & sonstige | `404.html` | Kopie von `index.html` |

  Häufigste Ursache für 404 auf einem klassischen Webspace: Die `.htaccess` ist
  beim Upload nicht mitgekommen – FTP-Clients blenden Dateien mit führendem
  Punkt standardmäßig aus (FileZilla: *Server → Versteckte Dateien anzeigen*).
  Läuft der Webspace auf nginx, muss die Regel dort gesetzt werden:
  `location / { try_files $uri $uri/ /index.html; }`.
- **HTTPS**: für die DSGVO-Konformität verpflichtend.
- **Server-Logs**: idealerweise mit anonymisierter IP (z. B. via Hosting-Provider
  konfigurieren); die Datenschutzerklärung geht davon aus.

## Struktur

```
src/
├── components/       # Header, Footer, FloatingProjects, GlassCutGame, Lightbox, CookieBanner
│   └── story/        # ScrollStory (Aufmaß-Animation) + GlassScene (three.js)
├── pages/            # Home, Service, Kontakt, Impressum, Datenschutz
├── data/             # services.ts (Leistungen) + projects.ts (Projekte & Stories)
├── lib/              # SEO Helpers + JSON-LD
└── styles/           # global.css
```

Leistungs-Inhalte leben in `services.ts`, die Projekt-Stories der schwebenden
Galerie in `projects.ts` – Anpassungen passieren jeweils an genau einer Stelle.
Die Scroll-Story auf der Startseite nutzt die Maße der Originalzeichnungen
(`Duschtüre schulstr..pdf`, `Seitenteil Dusche.pdf` im Repo-Root).
