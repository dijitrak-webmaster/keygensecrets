import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://keygensecrets.com';
const SITE_NAME = 'KeyGenSecrets';

interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface SoftwareApplicationSchema {
  '@context': string;
  '@type': string;
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
  description: string;
  url: string;
  browserRequirements: string;
}

export function WebSiteStructuredData() {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Free online developer crypto toolkit — 22+ tools to generate secrets, API keys, JWT tokens, passwords, RSA/ECDSA key pairs, UUIDs, hashes and more. All client-side using Web Crypto API.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function SoftwareApplicationStructuredData() {
  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (Web-based)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Browser-based cryptographic toolkit for developers. Generate secrets, API keys, JWT tokens, passwords, UUIDs, hashes, and encode/decode data using Web Crypto API.',
    url: SITE_URL,
    browserRequirements: 'Requires JavaScript. Works in all modern browsers with Web Crypto API support.',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
