import { type ToolDef } from '../tools/registry';

const SITE_URL = 'https://keygensecrets.com';

export interface ToolSEOMetadata {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
}

export function getToolSEOMetadata(tool: ToolDef): ToolSEOMetadata {
  return {
    title: tool.name,
    description: tool.description,
    canonical: `${SITE_URL}${tool.slug}`,
    keywords: [
      ...tool.keywords,
      'online tool',
      'free',
      'web crypto api',
      'client-side',
      'browser-based',
      'developer tool',
    ],
  };
}

export const categoryMetadata = {
  generators: {
    title: 'Generators',
    description: 'Generate cryptographically secure secrets, keys, tokens, UUIDs, and passwords using Web Crypto API',
  },
  crypto: {
    title: 'Crypto Tools',
    description: 'Hash, HMAC, AES, RSA, ECDSA cryptographic operations in the browser',
  },
  encoding: {
    title: 'Encoding Tools',
    description: 'Encode and decode Base64, Hex, URL with full UTF-8 support',
  },
  utilities: {
    title: 'Utilities',
    description: 'JWT decoder, timestamp converter, JSON formatter and more developer utilities',
  },
} as const;
