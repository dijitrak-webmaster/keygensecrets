# KeyGenSecrets

A free online developer crypto toolkit for generating secrets, keys, tokens, passwords, and encoding data — all client-side using the Web Crypto API. Nothing is transmitted to any server.

## Features

**Audience:** Software developers, DevOps engineers, security professionals, and anyone needing cryptographic utilities.

**Tools include:**
- **Generators:** Secret Key, API Key, JWT Secret, Password, Passphrase, UUID, Token, NanoID, TOTP 2FA, ULID
- **Crypto:** Hash (SHA-1/256/384/512), HMAC, AES Key, Random Bytes, RSA Key Pairs, ECDSA Key Pairs
- **Encoding:** Base64, Hex, URL encode/decode
- **Utilities:** JWT Decoder, Timestamp Converter, JSON Formatter

**Key principles:** Zero network calls for generation, 100% client-side, no accounts required, no cookies or tracking.

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
├── src/
│   ├── components/         # Shared components
│   ├── features/          # Tool implementations
│   ├── lib/               # Utilities and crypto functions
│   └── App.tsx            # Main app component
├── packages/
│   └── components/        # Reusable UI components
├── public/                # Static assets
└── dist/                  # Production build output
```

## Architecture

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Web Crypto API** for all cryptographic operations

## Security

All cryptographic operations are performed client-side using the browser's Web Crypto API. No data is transmitted to external servers. The application works completely offline once loaded.

## Browser Compatibility

Requires browsers with Web Crypto API support:
- Chrome 37+
- Firefox 34+
- Safari 11+
- Edge 12+

## License

MIT License - see LICENSE file for details.