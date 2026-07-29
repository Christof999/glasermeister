export type Service = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  description: string[];
  bullets: string[];
  hero: string;
  gallery: string[];
};

export const services: Service[] = [
  {
    slug: 'duschkabinen',
    title: 'Duschkabinen',
    short: 'Maßgefertigt, rahmenlos, kompromisslos dicht.',
    intro:
      'Großzügige Walk-in-Duschen oder filigrane Eckkabinen – millimetergenau auf Ihren Raum gefertigt.',
    description: [
      'Jede Dusche ist ein Unikat. Wir vermessen vor Ort, planen mit Ihnen Glasstärke, Beschläge und Oberflächenveredelung – und montieren sauber, ohne Kompromisse bei der Dichtigkeit.',
      'Auf Wunsch mit Klarglas, satinierter Oberfläche oder getöntem Grauglas für eine ruhige, moderne Optik. Sicherheitsglas (ESG) ist Standard.',
    ],
    bullets: [
      'Walk-in, Eck- oder U-Lösungen',
      'Echtglasduschen – rahmenlos, vollverklebt',
      'Klar, satiniert, getönt, Digitaldruck, teilflächige Verspiegelung oder als Vollspiegel',
      'Edelstahl- oder schwarze Beschläge',
      'Einscheiben-Sicherheitsglas (ESG) nach DIN EN 12150',
      'Ersatzscheiben für bestehende Duschtüren',
    ],
    hero: '/images/IMG_0301.jpeg',
    gallery: ['/images/IMG_0301.jpeg', '/images/IMG_0303.jpeg', '/images/IMG_0295.jpeg'],
  },
  {
    slug: 'glastueren',
    title: 'Glastüren & Trennwände',
    short: 'Räume teilen, ohne Licht zu nehmen.',
    intro:
      'Glasschwingtüren, Pendeltüren und raumhohe Trennwände – elegant, robust und perfekt eingepasst.',
    description: [
      'Eine Glastür schafft Struktur, ohne den Raum zu verkleinern. Wir planen Beschlagslage, Schließrichtung und Griffvariante gemeinsam mit Ihnen.',
      'Ob Schwingtür für das Büro, Pendeltür für den Empfangsbereich oder eine raumhohe Festverglasung als Treppenraum-Abschluss – wir liefern und montieren komplett.',
    ],
    bullets: [
      'Schwing- und Pendeltüren mit hochwertigen Beschlägen',
      'Ganzglastüren inkl. Setzen einer Holz- oder Aluminiumzarge',
      'Glas-Schiebetüren mit Decken- oder Wandlaufschiene',
      'Ganzglasanlagen für Büros, Praxen und Geschäfte',
      'Raumhohe Festverglasungen und Trennwände',
      'Klar, satiniert oder mit individuellen Motiven',
      'ESG / VSG nach statischer Anforderung',
    ],
    hero: '/images/IMG_0296.jpeg',
    gallery: ['/images/IMG_0296.jpeg', '/images/IMG_0302.jpeg'],
  },
  {
    slug: 'vordaecher',
    title: 'Vordächer & Überdachungen',
    short: 'Klare Kante. Wetterfest. Über Jahre.',
    intro:
      'Haustür-Vordächer und Terrassenüberdachungen aus Pulverbeschichtetem Stahl mit VSG-Glas.',
    description: [
      'Ein Vordach schützt Ihre Haustür und gibt der Eingangssituation Charakter. Wir planen Statik, Entwässerung und Befestigung individuell für Ihre Fassade.',
      'Eingesetzt wird Verbund-Sicherheitsglas (VSG) mit klarer oder satinierter Optik. Tragwerk pulverbeschichtet in der Farbe Ihrer Wahl – Standard ist Tiefschwarz matt.',
    ],
    bullets: [
      'Haustür-Vordächer in jeder Breite',
      'Terrassen- und Eingangsüberdachungen in Echtglas oder Acrylglas',
      'Pulverbeschichtetes Stahltragwerk',
      'Verbund-Sicherheitsglas (VSG) klar oder satiniert',
      'Inklusive Statik, Befestigung und Entwässerung',
    ],
    hero: '/images/IMG_0300.jpeg',
    gallery: ['/images/IMG_0300.jpeg', '/images/IMG_0299.jpeg'],
  },
  {
    slug: 'treppengelaender',
    title: 'Treppen­geländer & Brüstungen',
    short: 'Sicherheit, die den Raum öffnet.',
    intro:
      'Ganzglasgeländer für Treppen, Galerien und Brüstungen – mit oder ohne Holzhandlauf.',
    description: [
      'Glasgeländer machen Räume luftig und lassen Tageslicht ungebremst durch. Wir berechnen die zulässige Glasstärke nach Geländerart und Absturzhöhe.',
      'Punktbefestigung über Edelstahl-Glasträger oder seitliche Profilklemmung – je nach Architektur und Wunsch. Holzhandläufe in Eiche, Buche oder Nuss sind möglich.',
    ],
    bullets: [
      'Ganzglasgeländer mit Punktbefestigung',
      'Französische Balkone als filigrane Glaslösung',
      'Brüstungsverglasungen für Galerien und Treppenhäuser',
      'Seitliche Klemmprofil-Lösungen',
      'Holzhandlauf optional (Eiche, Buche, Nuss)',
      'Statisch nachgewiesen nach DIN 18008',
    ],
    hero: '/images/IMG_0302.jpeg',
    gallery: ['/images/IMG_0302.jpeg', '/images/IMG_0304.jpeg', '/images/IMG_0296.jpeg'],
  },
  {
    slug: 'antike-fenster',
    title: 'Antike Fenster restaurieren',
    short: 'Charakter erhalten, Wärme zurückgewinnen.',
    intro:
      'Sprossenfenster, Stallfenster und historische Verglasungen – fachgerecht erneuert.',
    description: [
      'Antike Fenster sind Teil der Geschichte eines Hauses. Wir tauschen blinde oder gerissene Scheiben, ersetzen Sprossen und passen die Verglasung an heutige Anforderungen an – ohne den ursprünglichen Charakter zu verlieren.',
      'Auch komplette Neuanfertigungen alter Stallfenster, Speicherfenster oder Kirchenfenster führen wir nach Maß aus.',
    ],
    bullets: [
      'Verglasung historischer Sprossenfenster',
      'Stall- und Speicherfenster nach altem Vorbild',
      'Bleiverglasungen reparieren und reinigen',
      'Behutsamer Umgang mit denkmalgeschützter Substanz',
    ],
    hero: '/images/IMG_0305.jpeg',
    gallery: ['/images/IMG_0305.jpeg'],
  },
];

export const getService = (slug: string | undefined): Service | undefined =>
  services.find((s) => s.slug === slug);
