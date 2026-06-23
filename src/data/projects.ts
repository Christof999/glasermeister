export type Project = {
  id: string;
  title: string;
  category: string;
  teaser: string;
  cover: string;
  images: string[];
  facts: { label: string; value: string }[];
  story: string[];
  /** layout hints for the floating gallery */
  size: 'lg' | 'md' | 'sm';
  depth: number; // 0 (front) … 1 (far back) – steers parallax & scale
  x: number; // 0–100 (% from left)
  y: number; // 0–100 (% from top of the stage)
};

export const projects: Project[] = [
  {
    id: 'dusche-schulstrasse',
    title: 'Dusche unterm Dach',
    category: 'Duschverglasung · Merkendorf',
    teaser: 'Zwei Scheiben, kein rechter Winkel – Grauglas folgt dem alten Gebälk.',
    cover: '/images/schulstrasse/img_1683.jpg',
    images: [
      '/images/schulstrasse/img_1683.jpg',
      '/images/schulstrasse/img_1682.jpg',
      '/images/schulstrasse/img_1681.jpg',
      '/images/schulstrasse/img_1541.jpg',
      '/images/schulstrasse/img_1540.jpg',
      '/images/schulstrasse/img_1537.jpg',
    ],
    facts: [
      { label: 'Glas', value: 'Parsol grau ESG, 8 + 10 mm' },
      { label: 'Türblatt', value: '753 × 1455 mm, Eckschräge' },
      { label: 'Seitenteil', value: '705 × 1158 mm, 5 Winkel' },
      { label: 'Kanten', value: 'feingeschliffen, R8 / R10' },
    ],
    story: [
      'Ein Bad im Dachgeschoss, ein Sichtbalken von 1780 quer durch den Raum – und eine Dusche, die genau dort hinein soll. Kein Winkel in dieser Nische ist ein rechter: Die Dachschräge fällt über die Sitzbank, die Wände laufen leicht aus dem Lot.',
      'Am Anfang steht das Aufmaß. Jede Kante wird vor Ort millimetergenau aufgenommen und in eine technische Zeichnung übersetzt: Das Türblatt bekommt eine Eckschräge für den Balken und gefräste Aussparungen für die Bänder, das Seitenteil folgt mit fünf Winkeln exakt der Schräge und der Sitzbank – 101,7°, 129,3°, 87,5° statt 90°.',
      'Gefertigt wurde in grau getöntem Einscheibensicherheitsglas (Parsol grau), die Kanten feingeschliffen, die Innenradien CNC-gefräst. Bei getöntem ESG gibt es keinen zweiten Versuch: Nach dem Vorspannen lässt sich nichts mehr nacharbeiten.',
      'Die Montage ist dann fast unspektakulär – wenn die Zeichnung stimmt. Beide Scheiben saßen beim ersten Einsetzen. Geblieben ist eine Dusche, die aussieht, als wäre sie schon immer Teil des alten Dachstuhls gewesen.',
    ],
    size: 'lg',
    depth: 0,
    x: 20,
    y: 34,
  },
  {
    id: 'walk-in-dusche',
    title: 'Walk-in aus einem Guss',
    category: 'Duschkabine',
    teaser: 'Rahmenlose Echtglasdusche – ein klarer Schnitt durchs Bad.',
    cover: '/images/IMG_0301.jpeg',
    images: ['/images/IMG_0301.jpeg', '/images/IMG_0303.jpeg', '/images/IMG_0295.jpeg'],
    facts: [
      { label: 'Glas', value: 'ESG nach DIN EN 12150' },
      { label: 'Bauart', value: 'rahmenlos, Walk-in' },
      { label: 'Beschläge', value: 'Edelstahl' },
    ],
    story: [
      'Eine Walk-in-Dusche lebt davon, dass man sie kaum sieht: kein Rahmen, keine Profile, nur eine Glasfläche, die den Raum ordnet, ohne ihn zu teilen.',
      'Damit das funktioniert, muss alles andere stimmen – das Aufmaß an Wand und Boden, die Glasstärke für die freistehende Kante, die Position der Stabilisatoren. Geplant wird jedes Detail vorab, montiert wird in wenigen Stunden.',
      'Das Ergebnis: ein Bad, das größer wirkt als vorher, und eine Dusche, die sich mit einem Handgriff reinigen lässt.',
    ],
    size: 'md',
    depth: 0.45,
    x: 50,
    y: 16,
  },
  {
    id: 'treppen-bruestung',
    title: 'Treppe ohne Stäbe',
    category: 'Absturzsicherung · Treppe',
    teaser: 'Rahmenlose Glasbrüstung als Absturzsicherung – Sicht frei, Treppe offen.',
    cover: '/images/IMG_0296.jpeg',
    images: ['/images/IMG_0296.jpeg', '/images/IMG_0302.jpeg'],
    facts: [
      { label: 'Funktion', value: 'Absturzsicherung Treppe' },
      { label: 'Bauart', value: 'Brüstungsverglasung, rahmenlos' },
      { label: 'Statik', value: 'nach DIN 18008' },
    ],
    story: [
      'Wo die Treppe ins offene Wohngeschoss führt, schreibt die Norm eine Absturzsicherung vor – klassische Geländerstäbe hätten den Blick zerschnitten. Hier übernimmt eine rahmenlose Glasbrüstung diese Aufgabe.',
      'Die Scheibe ist als Absturzsicherung nach DIN 18008 ausgelegt, oben sauber gefasst und millimetergenau an Treppe und Wand eingepasst. Die Sichtachse über beide Ebenen bleibt erhalten – die Treppe wirkt, als hätte sie nie ein Geländer gebraucht.',
    ],
    size: 'sm',
    depth: 0.7,
    x: 81,
    y: 26,
  },
  {
    id: 'vordach',
    title: 'Vordach mit klarer Kante',
    category: 'Vordach & Überdachung',
    teaser: 'Grau getöntes VSG auf pulverbeschichtetem Stahl – Wetterschutz ohne Schnörkel.',
    cover: '/images/IMG_0300.jpeg',
    images: ['/images/IMG_0300.jpeg', '/images/IMG_0299.jpeg'],
    facts: [
      { label: 'Glas', value: 'VSG, grau getönt' },
      { label: 'Tragwerk', value: 'Stahl, tiefschwarz matt' },
      { label: 'Leistung', value: 'inkl. Statik & Montage' },
    ],
    story: [
      'Ein Vordach ist das erste, was Besucher von einem Haus berühren – und oft das letzte, woran beim Bau gedacht wird.',
      'Hier wurde es zum Statement: grau getöntes Verbundsicherheitsglas auf einem pulverbeschichteten Stahltragwerk, Befestigung und Entwässerung in der Fassade verschwunden. Der Grauton nimmt dem Glas die Härte und dämpft das einfallende Licht. Geplant inklusive Statik, montiert an einem Vormittag.',
    ],
    size: 'md',
    depth: 0.3,
    x: 14,
    y: 77,
  },
  {
    id: 'kuechenrueckwand',
    title: 'Druck hinter Glas',
    category: 'Küchenrückwand',
    teaser: 'Bedrucktes Glas statt Fliesenspiegel – fugenlos und wischfest.',
    cover: '/images/IMG_0294.jpeg',
    images: ['/images/IMG_0294.jpeg'],
    facts: [
      { label: 'Glas', value: 'ESG, rückseitig bedruckt (Glasdruck)' },
      { label: 'Ausschnitte', value: 'Steckdosen CNC-gefräst' },
    ],
    story: [
      'Eine Küchenrückwand aus bedrucktem Glas ersetzt den Fliesenspiegel durch eine einzige fugenlose Fläche – Farbton oder Motiv werden direkt hinter das Glas gedruckt, nicht lackiert.',
      'Steckdosen und Übergänge werden vorab vermessen und CNC-genau ausgeschnitten. Montiert wird vollflächig verklebt: keine sichtbaren Halter, nichts, worin sich Fett festsetzen kann.',
    ],
    size: 'sm',
    depth: 0.8,
    x: 38,
    y: 83,
  },
  {
    id: 'vitrine',
    title: 'Vitrine nach Maß',
    category: 'Möbel & Sonderbau',
    teaser: 'Glas auf Gehrung – Handwerk aus der Werkstatt.',
    cover: '/images/IMG_0297.jpeg',
    images: ['/images/IMG_0297.jpeg', '/images/IMG_0298.jpeg'],
    facts: [
      { label: 'Bauart', value: 'Ganzglas, UV-verklebt' },
      { label: 'Fertigung', value: 'eigene Werkstatt' },
    ],
    story: [
      'Nicht alles, was wir bauen, ist ein Bauteil – manches ist ein Möbel. Diese Vitrine entstand komplett in der Werkstatt: Zuschnitt, Kantenschliff, UV-Verklebung auf Gehrung.',
      'Keine Rahmen, keine Schrauben. Nur Glasflächen, die so präzise aufeinandertreffen, dass der Kleber unsichtbar bleibt.',
    ],
    size: 'sm',
    depth: 0.55,
    x: 64,
    y: 84,
  },
  {
    id: 'gelaender',
    title: 'Brüstung ohne Barriere',
    category: 'Treppengeländer',
    teaser: 'Ganzglasgeländer – Sicherheit, die den Raum öffnet.',
    cover: '/images/IMG_0302.jpeg',
    images: ['/images/IMG_0302.jpeg', '/images/IMG_0304.jpeg'],
    facts: [
      { label: 'Statik', value: 'nach DIN 18008' },
      { label: 'Befestigung', value: 'Edelstahl-Punkthalter' },
    ],
    story: [
      'Eine Galerie mit Glasbrüstung statt Holzstaketen: Das Tageslicht fällt ungebremst bis ins Erdgeschoss, die Sicherheit ist statisch nachgewiesen.',
      'Glasstärke und Befestigung wurden nach Absturzhöhe berechnet, die Scheiben über Edelstahl-Punkthalter montiert – filigran in der Ansicht, kompromisslos in der Substanz.',
    ],
    size: 'md',
    depth: 0.45,
    x: 86,
    y: 72,
  },
];

export const getProject = (id: string | undefined): Project | undefined =>
  projects.find((p) => p.id === id);
