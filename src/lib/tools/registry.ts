import { lazy, type ComponentType } from 'react';
import {
  KeyRound, Code2, Lock, Fingerprint, Hash, Shuffle, Binary, FileKey,
  Shield, Braces, ArrowLeftRight, Zap, Link, ShieldCheck, Clock,
  BookOpen, FileSearch, Timer, Wrench
} from 'lucide-react';

export interface ToolDef {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: 'generators' | 'crypto' | 'encoding' | 'utilities';
  icon: ComponentType<{ className?: string }>;
  keywords: string[];
  component: ComponentType;
  localOnly: boolean;
}

const SecretGenerator = lazy(() => import('../../features/secret/SecretGenerator'));
const ApiKeyGenerator = lazy(() => import('../../features/api-key/ApiKeyGenerator'));
const JwtSecretGenerator = lazy(() => import('../../features/jwt-secret/JwtSecretGenerator'));
const PasswordGenerator = lazy(() => import('../../features/password/PasswordGenerator'));
const UuidGenerator = lazy(() => import('../../features/uuid/UuidGenerator'));
const TokenGenerator = lazy(() => import('../../features/token/TokenGenerator'));
const NanoIdGenerator = lazy(() => import('../../features/nanoid/NanoIdGenerator'));
const TotpSecretGenerator = lazy(() => import('../../features/totp/TotpSecretGenerator'));
const UlidGenerator = lazy(() => import('../../features/ulid/UlidGenerator'));
const HashGenerator = lazy(() => import('../../features/hash/HashGenerator'));
const HmacGenerator = lazy(() => import('../../features/hmac/HmacGenerator'));
const AesKeyGenerator = lazy(() => import('../../features/aes-key/AesKeyGenerator'));
const RandomBytesGenerator = lazy(() => import('../../features/random-bytes/RandomBytesGenerator'));
const Base64Tool = lazy(() => import('../../features/base64/Base64Tool'));
const HexTool = lazy(() => import('../../features/hex/HexTool'));
const UrlTool = lazy(() => import('../../features/url/UrlTool'));
const RsaKeyPairGenerator = lazy(() => import('../../features/rsa-keypair/RsaKeyPairGenerator'));
const EcdsaKeyPairGenerator = lazy(() => import('../../features/ecdsa-keypair/EcdsaKeyPairGenerator'));
const PassphraseGenerator = lazy(() => import('../../features/passphrase/PassphraseGenerator'));
const JwtDecoder = lazy(() => import('../../features/jwt-decoder/JwtDecoder'));
const TimestampConverter = lazy(() => import('../../features/timestamp/TimestampConverter'));
const JsonFormatter = lazy(() => import('../../features/json-formatter/JsonFormatter'));

export const tools: ToolDef[] = [
  // ── Generators ──
  {
    id: 'secret', slug: '/secret-generator', name: 'Secret Generator', shortName: 'Secret',
    description: 'Generate cryptographically secure random secrets',
    category: 'generators', icon: KeyRound,
    keywords: ['secret', 'random', 'key', 'token', 'entropy'],
    component: SecretGenerator, localOnly: true,
  },
  {
    id: 'api-key', slug: '/api-key-generator', name: 'API Key Generator', shortName: 'API Key',
    description: 'Generate structured API key credentials with prefixes',
    category: 'generators', icon: Code2,
    keywords: ['api', 'key', 'credential', 'sk_', 'pk_'],
    component: ApiKeyGenerator, localOnly: true,
  },
  {
    id: 'jwt-secret', slug: '/jwt-secret-generator', name: 'JWT Secret Generator', shortName: 'JWT Secret',
    description: 'Generate HMAC signing secrets for JSON Web Tokens',
    category: 'generators', icon: FileKey,
    keywords: ['jwt', 'json web token', 'hmac', 'hs256', 'hs384', 'hs512', 'signing'],
    component: JwtSecretGenerator, localOnly: true,
  },
  {
    id: 'password', slug: '/password-generator', name: 'Password Generator', shortName: 'Password',
    description: 'Generate strong passwords with configurable character sets',
    category: 'generators', icon: Lock,
    keywords: ['password', 'passphrase', 'strong', 'secure'],
    component: PasswordGenerator, localOnly: true,
  },
  {
    id: 'uuid', slug: '/uuid-generator', name: 'UUID Generator', shortName: 'UUID',
    description: 'Generate RFC 4122 compliant v4 UUIDs',
    category: 'generators', icon: Fingerprint,
    keywords: ['uuid', 'guid', 'unique', 'identifier', 'v4'],
    component: UuidGenerator, localOnly: true,
  },
  {
    id: 'token', slug: '/random-token-generator', name: 'Random Token Generator', shortName: 'Token',
    description: 'Generate random tokens of configurable length and format',
    category: 'generators', icon: Shuffle,
    keywords: ['token', 'random', 'string', 'nonce'],
    component: TokenGenerator, localOnly: true,
  },
  {
    id: 'nanoid', slug: '/nanoid-generator', name: 'NanoID Generator', shortName: 'NanoID',
    description: 'Generate compact, URL-friendly unique identifiers',
    category: 'generators', icon: Zap,
    keywords: ['nanoid', 'nano', 'id', 'compact', 'url-friendly'],
    component: NanoIdGenerator, localOnly: true,
  },
  {
    id: 'totp', slug: '/totp-secret-generator', name: 'TOTP Secret Generator', shortName: 'TOTP',
    description: 'Generate Base32 secrets for two-factor authentication',
    category: 'generators', icon: ShieldCheck,
    keywords: ['totp', 'otp', '2fa', 'two-factor', 'authenticator', 'google authenticator', 'base32'],
    component: TotpSecretGenerator, localOnly: true,
  },
  {
    id: 'ulid', slug: '/ulid-generator', name: 'ULID Generator', shortName: 'ULID',
    description: 'Generate sortable, time-encoded unique identifiers',
    category: 'generators', icon: Clock,
    keywords: ['ulid', 'sortable', 'unique', 'identifier', 'timestamp', 'crockford'],
    component: UlidGenerator, localOnly: true,
  },
  {
    id: 'passphrase', slug: '/passphrase-generator', name: 'Passphrase Generator', shortName: 'Passphrase',
    description: 'Generate memorable, high-entropy word-based passphrases',
    category: 'generators', icon: BookOpen,
    keywords: ['passphrase', 'diceware', 'words', 'memorable', 'password'],
    component: PassphraseGenerator, localOnly: true,
  },

  // ── Crypto ──
  {
    id: 'hash', slug: '/hash-generator', name: 'Hash Generator', shortName: 'Hash',
    description: 'Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes',
    category: 'crypto', icon: Hash,
    keywords: ['hash', 'sha', 'sha256', 'sha512', 'digest', 'checksum'],
    component: HashGenerator, localOnly: true,
  },
  {
    id: 'hmac', slug: '/hmac-generator', name: 'HMAC Generator', shortName: 'HMAC',
    description: 'Compute HMAC message authentication codes',
    category: 'crypto', icon: Shield,
    keywords: ['hmac', 'mac', 'message authentication', 'signing'],
    component: HmacGenerator, localOnly: true,
  },
  {
    id: 'aes-key', slug: '/aes-key-generator', name: 'AES Key Generator', shortName: 'AES Key',
    description: 'Generate AES encryption keys',
    category: 'crypto', icon: KeyRound,
    keywords: ['aes', 'encryption', 'symmetric', 'key', '128', '256'],
    component: AesKeyGenerator, localOnly: true,
  },
  {
    id: 'random-bytes', slug: '/random-bytes-generator', name: 'Random Bytes Generator', shortName: 'Random Bytes',
    description: 'Generate cryptographically secure random bytes',
    category: 'crypto', icon: Binary,
    keywords: ['bytes', 'random', 'entropy', 'iv', 'nonce', 'seed'],
    component: RandomBytesGenerator, localOnly: true,
  },
  {
    id: 'rsa-keypair', slug: '/rsa-key-pair-generator', name: 'RSA Key Pair Generator', shortName: 'RSA Keys',
    description: 'Generate RSA public/private key pairs in PEM format',
    category: 'crypto', icon: KeyRound,
    keywords: ['rsa', 'key pair', 'public key', 'private key', 'pem', 'asymmetric', 'pkcs8'],
    component: RsaKeyPairGenerator, localOnly: true,
  },
  {
    id: 'ecdsa-keypair', slug: '/ecdsa-key-pair-generator', name: 'ECDSA Key Pair Generator', shortName: 'ECDSA Keys',
    description: 'Generate elliptic curve key pairs for signing',
    category: 'crypto', icon: KeyRound,
    keywords: ['ecdsa', 'ec', 'elliptic curve', 'p-256', 'p-384', 'p-521', 'key pair', 'signing'],
    component: EcdsaKeyPairGenerator, localOnly: true,
  },

  // ── Encoding ──
  {
    id: 'base64', slug: '/base64', name: 'Base64 Encode / Decode', shortName: 'Base64',
    description: 'Encode and decode Base64 with full UTF-8 support',
    category: 'encoding', icon: ArrowLeftRight,
    keywords: ['base64', 'encode', 'decode', 'encoding', 'binary'],
    component: Base64Tool, localOnly: true,
  },
  {
    id: 'hex', slug: '/hex', name: 'Hex Encode / Decode', shortName: 'Hex',
    description: 'Convert between text and hexadecimal',
    category: 'encoding', icon: Binary,
    keywords: ['hex', 'hexadecimal', 'encode', 'decode', '0x'],
    component: HexTool, localOnly: true,
  },
  {
    id: 'url', slug: '/url-encode', name: 'URL Encode / Decode', shortName: 'URL',
    description: 'Encode and decode URL components',
    category: 'encoding', icon: Link,
    keywords: ['url', 'percent', 'encode', 'decode', 'uri', 'query string'],
    component: UrlTool, localOnly: true,
  },

  // ── Utilities ──
  {
    id: 'jwt-decoder', slug: '/jwt-decoder', name: 'JWT Decoder', shortName: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Token header and payload',
    category: 'utilities', icon: FileSearch,
    keywords: ['jwt', 'json web token', 'decode', 'inspect', 'header', 'payload', 'claims'],
    component: JwtDecoder, localOnly: true,
  },
  {
    id: 'timestamp', slug: '/timestamp-converter', name: 'Timestamp Converter', shortName: 'Timestamp',
    description: 'Convert between Unix timestamps and human-readable dates',
    category: 'utilities', icon: Timer,
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert', 'iso'],
    component: TimestampConverter, localOnly: true,
  },
  {
    id: 'json-formatter', slug: '/json-formatter', name: 'JSON Formatter', shortName: 'JSON Format',
    description: 'Format, validate and minify JSON data',
    category: 'utilities', icon: Braces,
    keywords: ['json', 'format', 'prettify', 'minify', 'validate', 'lint'],
    component: JsonFormatter, localOnly: true,
  },
];

export const categories = [
  { id: 'generators' as const, label: 'Generators', icon: Binary },
  { id: 'crypto' as const, label: 'Crypto', icon: Shield },
  { id: 'encoding' as const, label: 'Encoding', icon: Braces },
  { id: 'utilities' as const, label: 'Utilities', icon: Wrench },
];

export function getToolsByCategory(cat: string) {
  return tools.filter(t => t.category === cat);
}

export function searchTools(query: string): ToolDef[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.shortName.toLowerCase().includes(q) ||
    t.keywords.some(k => k.includes(q)) ||
    t.description.toLowerCase().includes(q)
  );
}
