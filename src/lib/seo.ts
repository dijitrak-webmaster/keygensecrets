import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tools } from './tools/registry';

const BASE_TITLE = 'KeyGenSecrets';
const BASE_DESC = 'Free online developer crypto toolkit — generate secrets, API keys, JWT tokens, passwords, UUIDs, RSA/ECDSA key pairs, passphrases, hashes, and encode data. All client-side using Web Crypto API.';

const TOOL_SEO: Record<string, { title: string; desc: string }> = {
  '/secret-generator': {
    title: 'Free Secret Key Generator Online — 128 to 512-bit',
    desc: 'Generate cryptographically secure random secrets (128–512 bit) in Base64URL, Hex, or Alphanumeric format. 100% client-side using Web Crypto API.',
  },
  '/api-key-generator': {
    title: 'Free API Key Generator Online — sk_live_, pk_test_ & Custom Prefixes',
    desc: 'Generate random API keys with custom prefixes (sk_live_, pk_test_, api_). Configurable length and format. No server, pure client-side.',
  },
  '/jwt-secret-generator': {
    title: 'Free JWT Secret Generator — HS256, HS384, HS512',
    desc: 'Generate HMAC signing secrets for JWT (JSON Web Tokens). Supports HS256, HS384, HS512. Copy as .env ready. Client-side only.',
  },
  '/password-generator': {
    title: 'Free Strong Password Generator Online — Up to 128 Characters',
    desc: 'Generate strong random passwords with configurable length, character sets, and strength indicator. Cryptographically secure, runs locally.',
  },
  '/uuid-generator': {
    title: 'Free UUID v4 Generator Online — Bulk Generate UUIDs',
    desc: 'Generate RFC 4122 compliant UUIDv4 identifiers. Batch generation up to 50 UUIDs. Uses crypto.randomUUID(). 100% local.',
  },
  '/random-token-generator': {
    title: 'Free Random Token Generator — CSRF, Session, Nonce',
    desc: 'Generate random tokens for CSRF protection, session IDs, nonces, and verification codes. Configurable length (8–256) and character set.',
  },
  '/nanoid-generator': {
    title: 'Free NanoID Generator Online — Compact URL-Friendly IDs',
    desc: 'Generate NanoID identifiers (URL-friendly, compact, 126-bit entropy). Configurable length. Shorter than UUID with same uniqueness guarantee.',
  },
  '/totp-secret-generator': {
    title: 'Free TOTP Secret Generator — 2FA / Google Authenticator',
    desc: 'Generate Base32 TOTP secrets for two-factor authentication. Compatible with Google Authenticator, Authy, 1Password. Includes OTPAuth URI.',
  },
  '/ulid-generator': {
    title: 'Free ULID Generator Online — Sortable Unique Identifiers',
    desc: 'Generate ULID (Universally Unique Lexicographically Sortable Identifiers). Time-encoded, Crockford Base32, shorter than UUID, sortable.',
  },
  '/hash-generator': {
    title: 'Free SHA-256 / SHA-512 Hash Generator Online',
    desc: 'Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes instantly. Client-side using Web Crypto API SubtleCrypto.digest(). No data sent anywhere.',
  },
  '/hmac-generator': {
    title: 'Free HMAC Generator Online — SHA-256, SHA-512',
    desc: 'Compute HMAC (Hash-based Message Authentication Code) with SHA-1/256/384/512. Enter key and message, get HMAC. Client-side only.',
  },
  '/aes-key-generator': {
    title: 'Free AES Encryption Key Generator — 128, 192, 256-bit',
    desc: 'Generate random AES encryption keys (AES-128, AES-192, AES-256) in Base64URL or Hex format. Cryptographically secure, local generation.',
  },
  '/random-bytes-generator': {
    title: 'Free Random Bytes Generator — Hex & Base64 Output',
    desc: 'Generate cryptographically secure random bytes (4–128 bytes) encoded as Hex or Base64. For IVs, nonces, seeds, and raw entropy.',
  },
  '/base64': {
    title: 'Free Base64 Encode / Decode Online — UTF-8 Support',
    desc: 'Encode and decode Base64 with full UTF-8 support. Instant conversion, works offline. No data sent to any server.',
  },
  '/hex': {
    title: 'Free Hex Encode / Decode Online — Text to Hexadecimal',
    desc: 'Convert text to hexadecimal and hex back to text. Instant client-side conversion with UTF-8 support.',
  },
  '/url-encode': {
    title: 'Free URL Encode / Decode Online — Percent Encoding',
    desc: 'Encode and decode URL components using encodeURIComponent/decodeURIComponent. Essential for query strings and URL-safe values.',
  },
  '/rsa-key-pair-generator': {
    title: 'Free RSA Key Pair Generator Online — 2048 & 4096-bit PEM',
    desc: 'Generate RSA public/private key pairs in PEM format using Web Crypto API. 2048-bit or 4096-bit. Keys never leave your browser.',
  },
  '/ecdsa-key-pair-generator': {
    title: 'Free ECDSA Key Pair Generator Online — P-256, P-384, P-521',
    desc: 'Generate ECDSA elliptic curve key pairs in PEM format. Supports P-256, P-384, P-521 NIST curves. 100% client-side generation.',
  },
  '/passphrase-generator': {
    title: 'Free Passphrase Generator Online — Diceware-Style Word Passphrases',
    desc: 'Generate strong, memorable passphrases from random word combinations. Configurable word count, separator, and capitalization. Cryptographically secure.',
  },
  '/jwt-decoder': {
    title: 'Free JWT Decoder Online — Inspect Token Header & Payload',
    desc: 'Decode and inspect JSON Web Tokens (JWT). View header, payload claims, and expiration. No verification — client-side decode only.',
  },
  '/timestamp-converter': {
    title: 'Free Unix Timestamp Converter Online — Epoch to Date',
    desc: 'Convert between Unix timestamps (seconds/milliseconds) and human-readable dates. Live clock, ISO 8601, UTC, and relative time.',
  },
  '/json-formatter': {
    title: 'Free JSON Formatter & Validator Online — Prettify & Minify',
    desc: 'Format, validate, and minify JSON data. Configurable indentation, real-time validation, and stats. Runs entirely in your browser.',
  },
};

export function usePageSeo() {
  const location = useLocation();

  useEffect(() => {
    const seo = TOOL_SEO[location.pathname];
    if (seo) {
      document.title = `${seo.title} | ${BASE_TITLE}`;
      setMeta('description', seo.desc);
      setMeta('og:title', `${seo.title} | ${BASE_TITLE}`);
      setMeta('og:description', seo.desc);
    } else {
      document.title = `${BASE_TITLE} — Free Online Developer Crypto Toolkit`;
      setMeta('description', BASE_DESC);
      setMeta('og:title', `${BASE_TITLE} — Free Online Developer Crypto Toolkit`);
      setMeta('og:description', BASE_DESC);
    }
    // Canonical URL
    setLink('canonical', `https://keygensecrets.com${location.pathname === '/' ? '' : location.pathname}`);
  }, [location.pathname]);
}

function setMeta(name: string, content: string) {
  const isOg = name.startsWith('og:');
  const selector = isOg ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (isOg) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Returns JSON-LD structured data for the current page */
export function getStructuredData(pathname: string): object | null {
  const tool = tools.find(t => t.slug === pathname);
  if (!tool) return null;
  const seo = TOOL_SEO[pathname];
  if (!seo) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: seo.desc,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `https://keygensecrets.com${pathname}`,
  };
}
