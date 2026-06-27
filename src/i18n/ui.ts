import type { Lang } from './index';

export type UiEntry = Record<Lang, string>;

/**
 * Oberflächentexte (UI-Chrome) in Deutsch, Englisch und Latein.
 * Inhalte (Leistungen, Projekte) liegen separat unter ./content.
 *
 * Hinweis: Die lateinischen Fassungen sind sorgfältig, aber maschinell
 * erstellt und zur muttersprachlichen Prüfung gedacht. Für Glaser-
 * Fachbegriffe gibt es kein klassisches Vokabular – hier stehen sinngemäße
 * Umschreibungen.
 */
export const ui = {
  // ---- Navigation / Header ----
  'nav.start': { de: 'Start', en: 'Home', la: 'Initium' },
  'nav.story': { de: 'Die Story', en: 'The Story', la: 'Fabula' },
  'nav.projects': { de: 'Projekte', en: 'Projects', la: 'Opera' },
  'nav.contact': { de: 'Kontakt', en: 'Contact', la: 'Contactus' },
  'nav.aria': { de: 'Hauptnavigation', en: 'Main navigation', la: 'Navigatio principalis' },
  'nav.toStart': { de: 'zur Startseite', en: 'to homepage', la: 'ad paginam principalem' },
  'menu.open': { de: 'Menü öffnen', en: 'Open menu', la: 'Aperi indicem' },
  'menu.close': { de: 'Menü schließen', en: 'Close menu', la: 'Claude indicem' },
  'lang.label': { de: 'Sprache', en: 'Language', la: 'Lingua' },

  // ---- Layout ----
  'skip.toContent': {
    de: 'Zum Hauptinhalt springen',
    en: 'Skip to main content',
    la: 'Ad contentum principale transi',
  },

  // ---- Footer ----
  'footer.claim': {
    de: 'Individuelle Glaslösungen aus Meisterhand – geplant und ausgeführt von Patrick Stettner.',
    en: 'Bespoke glass solutions by a master craftsman – planned and built by Patrick Stettner.',
    la: 'Solutiones vitreae propriae manu magistri – a Patricio Stettner consultae et confectae.',
  },
  'footer.services': { de: 'Leistungen', en: 'Services', la: 'Officia' },
  'footer.contact': { de: 'Kontakt', en: 'Contact', la: 'Contactus' },
  'footer.legal': { de: 'Rechtliches', en: 'Legal', la: 'Iuridica' },
  'footer.imprint': { de: 'Impressum', en: 'Imprint', la: 'Impressum' },
  'footer.privacy': { de: 'Datenschutz', en: 'Privacy', la: 'Datenschutz' },
  'footer.role': {
    de: 'Glasermeister · Merkendorf · Mittelfranken',
    en: 'Master glazier · Merkendorf · Middle Franconia',
    la: 'Vitrarius magister · Merkendorf · Franconia Media',
  },

  // ---- Cookie / Datenschutz-Hinweis ----
  'cookie.aria': {
    de: 'Hinweis zum Datenschutz',
    en: 'Privacy notice',
    la: 'Monitio de privatis',
  },
  'cookie.pre': {
    de: 'Diese Website verwendet ',
    en: 'This website uses ',
    la: 'Hic situs utitur ',
  },
  'cookie.strong': {
    de: 'keine Cookies und kein Tracking',
    en: 'no cookies and no tracking',
    la: 'nullis crustulis nullaque indagatione',
  },
  'cookie.mid': {
    de: '. Es werden ausschließlich technisch notwendige Daten verarbeitet. Mehr in der ',
    en: '. Only technically necessary data is processed. More in the ',
    la: '. Sola data technice necessaria tractantur. Plura in ',
  },
  'cookie.linkText': {
    de: 'Datenschutzerklärung',
    en: 'privacy policy',
    la: 'declaratione de privatis',
  },
  'cookie.post': { de: '.', en: '.', la: '.' },
  'cookie.ok': { de: 'Verstanden', en: 'Got it', la: 'Intellexi' },

  // ---- Sphere (Projekte) ----
  'ws.eyebrow': { de: 'Projekte', en: 'Projects', la: 'Opera' },
  'ws.title': {
    de: 'Meine Arbeiten entdecken',
    en: 'Discover my work',
    la: 'Opera mea explora',
  },
  'ws.ctaText': {
    de: '{n} Projekte, ein Raum – mittendrin statt nur davor.',
    en: '{n} projects, one room – right in the middle, not just in front.',
    la: '{n} opera, unum spatium – in medio, non tantum ante.',
  },
  'ws.enter': { de: 'Sphäre betreten', en: 'enter the sphere', la: 'intra sphaeram' },
  'ws.exit': { de: 'Sphäre verlassen', en: 'exit the sphere', la: 'exi sphaeram' },
  'ws.hint': {
    de: 'Umsehen: Maus bewegen oder wischen · Projekt antippen für Details',
    en: 'Look around: move the mouse or swipe · tap a project for details',
    la: 'Circumspice: murem move vel verre · opus tange pro singulis',
  },
  'ws.roomAria': {
    de: 'Meine Arbeiten – begehbarer 3D-Raum',
    en: 'My work – a walk-in 3D space',
    la: 'Opera mea – spatium 3D adeundum',
  },
  'ws.simpleLead': {
    de: 'Jedes Projekt ein Unikat – tippen Sie ein Bild an und lesen Sie, wie es entstanden ist.',
    en: 'Every project unique – tap an image and read how it came to be.',
    la: 'Unumquodque opus unicum – imaginem tange et lege quomodo factum sit.',
  },

  // ---- Projekt-Modal ----
  'modal.ctaPre': { de: 'Ähnliches Projekt?', en: 'A similar project?', la: 'Opus simile?' },
  'modal.close': { de: 'Schließen', en: 'Close', la: 'Claude' },
  'modal.thumbsAria': { de: 'Projektbilder', en: 'Project images', la: 'Imagines operis' },
  'modal.imgAlt': {
    de: '{title} – Bild {i} von {n}',
    en: '{title} – image {i} of {n}',
    la: '{title} – imago {i} ex {n}',
  },

  // ---- Home: Leistungen-Teaser + CTA ----
  'home.servicesHeading': {
    de: 'Außerdem aus Meisterhand',
    en: 'Also from the master’s hand',
    la: 'Item manu magistri',
  },
  'cta.heading': {
    de: 'Ihr Projekt beginnt mit einem Maßband.',
    en: 'Your project starts with a tape measure.',
    la: 'Opus tuum metro incipit.',
  },
  'cta.lead': {
    de: 'Ein kurzer Anruf reicht meist, um zu sagen, ob und wie sich Ihre Vorstellung umsetzen lässt – das Aufmaß übernehme ich.',
    en: 'A short call is usually enough to say whether and how your idea can be realised – I take care of the measuring.',
    la: 'Brevis vocatus plerumque sufficit ut dicam an et quomodo consilium tuum perfici possit – mensuram ipse curo.',
  },

  // ---- Kontakt ----
  'contact.eyebrow': { de: 'Kontakt', en: 'Contact', la: 'Contactus' },
  'contact.h1': { de: 'Ein Anruf genügt.', en: 'One call is enough.', la: 'Unus vocatus sufficit.' },
  'contact.lead': {
    de: 'Am schnellsten klären wir Ihr Vorhaben im Gespräch – kostenlos und unverbindlich. Tagsüber bin ich oft auf der Baustelle: Hinterlassen Sie eine Nachricht, ich rufe garantiert zurück.',
    en: 'The quickest way is to talk it through – free and without obligation. During the day I’m often on site: leave a message and I’ll call you back, guaranteed.',
    la: 'Celerrime rem tuam colloquio expedimus – gratis et sine obligatione. Interdiu saepe in opere sum: nuntium relinque, certe revocabo.',
  },
  'contact.phoneLabel': { de: 'Telefon', en: 'Phone', la: 'Telephonum' },
  'contact.phoneHint': {
    de: 'Mo – Fr · nach Terminvereinbarung',
    en: 'Mon – Fri · by appointment',
    la: 'Lun – Ven · ex condicto',
  },
  'contact.emailLabel': { de: 'E-Mail', en: 'Email', la: 'Epistula electronica' },
  'contact.emailHint': {
    de: 'Gern mit Fotos und groben Maßen – das beschleunigt das Angebot.',
    en: 'Photos and rough measurements help – they speed up the quote.',
    la: 'Cum imaginibus et mensuris fere notatis – pretium acceleras.',
  },
  'contact.addressHeading': {
    de: 'Werkstatt & Anschrift',
    en: 'Workshop & address',
    la: 'Officina & inscriptio',
  },
  'contact.mapLink': {
    de: 'Auf OpenStreetMap ansehen',
    en: 'View on OpenStreetMap',
    la: 'In OpenStreetMap vide',
  },
  'contact.areaLabel': { de: 'Einzugsgebiet', en: 'Service area', la: 'Regio operis' },
  'contact.areaText': {
    de: 'Merkendorf, Ansbach, Gunzenhausen, Weißenburg – Mittelfranken & Umgebung.',
    en: 'Merkendorf, Ansbach, Gunzenhausen, Weißenburg – Middle Franconia & surroundings.',
    la: 'Merkendorf, Ansbach, Gunzenhausen, Weißenburg – Franconia Media et vicinia.',
  },
  'contact.seoTitle': {
    de: 'Kontakt – der-glasermeister Merkendorf',
    en: 'Contact – der-glasermeister Merkendorf',
    la: 'Contactus – der-glasermeister Merkendorf',
  },
  'contact.seoDesc': {
    de: 'Rufen Sie direkt an: 0175 2533137 – oder schreiben Sie eine E-Mail. Glasermeister Patrick Stettner aus Merkendorf, Anfragen kostenlos.',
    en: 'Call directly: 0175 2533137 – or send an email. Master glazier Patrick Stettner from Merkendorf, enquiries free of charge.',
    la: 'Voca directe: 0175 2533137 – vel epistulam mitte. Vitrarius magister Patricius Stettner Merkendorfio, rogationes gratuitae.',
  },

  // ---- 404 ----
  'nf.eyebrow': { de: 'Fehler 404', en: 'Error 404', la: 'Error 404' },
  'nf.h1': { de: 'Seite nicht gefunden.', en: 'Page not found.', la: 'Pagina non inventa.' },
  'nf.lead': {
    de: 'Diese Adresse existiert nicht (mehr). Vielleicht hilft Ihnen einer der Links weiter.',
    en: 'This address does not exist (any more). Perhaps one of these links helps.',
    la: 'Haec inscriptio non (iam) exstat. Fortasse unus ex nexibus iuvabit.',
  },
  'nf.toHome': { de: 'Zur Startseite', en: 'To homepage', la: 'Ad paginam principalem' },
  'nf.toContact': { de: 'Kontakt aufnehmen', en: 'Get in touch', la: 'Contactum quaere' },
  'nf.seoTitle': { de: 'Seite nicht gefunden', en: 'Page not found', la: 'Pagina non inventa' },
  'nf.seoDesc': {
    de: 'Diese Seite existiert nicht.',
    en: 'This page does not exist.',
    la: 'Haec pagina non exstat.',
  },

  // ---- Leistungs-Seite ----
  'srv.back': { de: 'Zurück zur Übersicht', en: 'Back to overview', la: 'Ad conspectum redi' },
  'srv.eyebrow': { de: 'Leistung', en: 'Service', la: 'Officium' },
  'srv.bullets': { de: 'Eckpunkte', en: 'Key points', la: 'Puncta praecipua' },
  'srv.cta': { de: 'Angebot anfragen', en: 'Request a quote', la: 'Pretium roga' },
  'srv.examplesEyebrow': { de: 'Eindrücke', en: 'Impressions', la: 'Imagines' },
  'srv.examplesHeading': {
    de: 'Beispiele aus bereits umgesetzten Objekten',
    en: 'Examples from completed projects',
    la: 'Exempla ex operibus iam confectis',
  },
  'srv.more': { de: 'Weitere Leistungen', en: 'More services', la: 'Plura officia' },
  'srv.learnMore': { de: 'Mehr erfahren', en: 'Learn more', la: 'Plura' },
  'srv.exampleAlt': {
    de: '{title} – Beispiel {i}',
    en: '{title} – example {i}',
    la: '{title} – exemplum {i}',
  },
  'srv.enlargeAria': {
    de: 'Bild {i} vergrößern',
    en: 'Enlarge image {i}',
    la: 'Imaginem {i} amplifica',
  },

  // ---- Bewertungen ----
  'reviews.eyebrow': { de: 'Bewertungen', en: 'Reviews', la: 'Iudicia' },
  'reviews.heading': {
    de: 'Was Kundinnen und Kunden sagen.',
    en: 'What customers say.',
    la: 'Quid clientes dicant.',
  },
  'reviews.all': {
    de: 'Alle Bewertungen ansehen',
    en: 'See all reviews',
    la: 'Omnia iudicia vide',
  },
  'reviews.count': {
    de: '{n} Bewertungen auf Google',
    en: '{n} reviews on Google',
    la: '{n} iudicia apud Google',
  },
  'reviews.starsAria': {
    de: '{v} von 5 Sternen',
    en: '{v} out of 5 stars',
    la: '{v} ex 5 stellis',
  },
  'reviews.scoreAria': {
    de: 'Durchschnitt {v} von 5 Sternen',
    en: 'Average {v} out of 5 stars',
    la: 'Media {v} ex 5 stellis',
  },
  'reviews.when.1y': { de: 'vor einem Jahr', en: 'a year ago', la: 'abhinc annum' },
  'reviews.when.6m': { de: 'vor 6 Monaten', en: '6 months ago', la: 'abhinc 6 menses' },
  'reviews.when.2y': { de: 'vor 2 Jahren', en: '2 years ago', la: 'abhinc 2 annos' },
} satisfies Record<string, UiEntry>;

export type UiKey = keyof typeof ui;
