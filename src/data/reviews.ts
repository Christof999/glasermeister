export type Review = {
  author: string;
  rating: 5;
  when: string;
  text: string;
};

export const reviews: Review[] = [
  {
    author: 'Andrea Gofferje',
    rating: 5,
    when: 'vor einem Jahr',
    text:
      'Absolut schnell, zuverlässig, fairer Preis, saubere Arbeit. Ist im Handwerksbereich keine Selbstverständlichkeit mehr. Glaserei Stettner aus Merkendorf kann man zu 100 Prozent und ohne wenn und aber weiterempfehlen.',
  },
  {
    author: 'Alexander Hock',
    rating: 5,
    when: 'vor einem Jahr',
    text:
      'Wir haben eine Funkenschutzplatte für unseren Kamin machen lassen. TOP Arbeit – hier ist der Firmenname Programm. Man merkt, dass ein Glasermeister am Werk ist.',
  },
  {
    author: 'Lani',
    rating: 5,
    when: 'vor 6 Monaten',
    text:
      'Schon das zweite Mal gebraucht. Super freundlich und kompetent! Schnell und zuverlässig. Preis-Leistung top! Nicht selbstverständlich heut zu Tage. Empfehlenswert.',
  },
  {
    author: 'Uwe Frankl',
    rating: 5,
    when: 'vor 2 Jahren',
    text:
      'Einbau einer Ersatz-Glasplatte (VSG) für Kellerabgang. Beratung und Qualität herausragend. Alles top von der Vermessung bis zum Einbau und der Abrechnung mit der Glasversicherung.',
  },
  {
    author: 'Linda Haberstroh',
    rating: 5,
    when: 'vor 2 Jahren',
    text:
      'Ich habe etwas besonderes gebraucht und bekommen! Einen Facetten-Spiegel nach Maß ist nicht einfach zu finden, aber hier bekommt man ihn.',
  },
  {
    author: 'J. K.',
    rating: 5,
    when: 'vor 2 Jahren',
    text:
      'Ich bin begeistert. Er hat sofort auf meine Anfrage reagiert, sich den Schaden an meiner Duschtüre vor Ort angesehen, zeitnah für Ersatz gesorgt – und das zu einem absolut fairen Preis. Jederzeit gerne wieder!',
  },
  {
    author: 'Mario Dietlein',
    rating: 5,
    when: 'vor 2 Jahren',
    text: 'Sehr nett und freundlich. Super Beratung mit tollen Ideen.',
  },
  {
    author: 'Nico Kleeflügel',
    rating: 5,
    when: 'vor 2 Jahren',
    text: 'Schnell, kompetent, ehrlich und preiswert. Jederzeit gerne wieder.',
  },
  {
    author: 'Alex Gedeon',
    rating: 5,
    when: 'vor 2 Jahren',
    text: 'Super schnell und zuverlässig. Saubere Arbeit!',
  },
  {
    author: 'Horst Huber',
    rating: 5,
    when: 'vor 2 Jahren',
    text: 'Ein echter Fachmann!',
  },
];

export const reviewStats = {
  ratingValue: 5,
  reviewCount: reviews.length,
};
