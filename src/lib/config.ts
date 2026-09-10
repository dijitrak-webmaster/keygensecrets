// Environment configuration
export const config = {
  // App info
  app: {
    name: 'KeyGenSecrets',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
    version: '1.0.0',
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
    isProduction: import.meta.env.VITE_NODE_ENV === 'production',
    isStaging: import.meta.env.VITE_NODE_ENV === 'staging',
  },

  // Features
  features: {
    analytics: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    webVitals: import.meta.env.VITE_NODE_ENV === 'production',
  },

  // Analytics
  analytics: {
    plausible: {
      domain: getDomain(),
      enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true' && import.meta.env.VITE_NODE_ENV === 'production',
    },
  },

  // URLs
  urls: {
    github: 'https://github.com/keygensecrets',
    support: 'mailto:support@keygensecrets.com',
    security: 'mailto:security@keygensecrets.com',
  },
} as const;

function getDomain(): string {
  if (typeof window === 'undefined') return 'keygensecrets.com';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'keygensecrets.com') return 'keygensecrets.com';
  if (hostname.includes('vercel.app')) return 'keygensecrets-preview.vercel.app';
  
  return 'localhost';
}

// Type exports
export type Config = typeof config;