import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.der-glasermeister.de';
const SITE_NAME = 'der-glasermeister';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: object;
};

export function Seo({ title, description, path = '/', image, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/images/IMG_0299.jpeg`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'der-glasermeister',
  legalName: 'der-glasermeister – Einzelunternehmen Patrick Stettner',
  description:
    'Glasermeister Patrick Stettner – Duschkabinen, Glastüren, Vordächer, Treppengeländer und Restaurierung antiker Fenster aus Merkendorf.',
  url: SITE_URL,
  image: `${SITE_URL}/images/IMG_0299.jpeg`,
  telephone: '+49 175 2533137',
  email: 'info@der-glasermeister.de',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Schulstr. 20',
    postalCode: '91732',
    addressLocality: 'Merkendorf',
    addressCountry: 'DE',
  },
  areaServed: 'Bayern',
  founder: { '@type': 'Person', name: 'Patrick Stettner', jobTitle: 'Glasermeister' },
  vatID: 'DE357501503',
};
