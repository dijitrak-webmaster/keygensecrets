declare global {
  interface Window {
    plausible: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

// Web Vitals tracking - only in production
export const trackWebVitals = () => {
  if (typeof window === 'undefined' || 
      import.meta.env.VITE_NODE_ENV !== 'production' ||
      import.meta.env.VITE_ANALYTICS_ENABLED !== 'true') return;

  // Track Core Web Vitals
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => trackMetric('CLS', metric.value));
    onFID((metric) => trackMetric('FID', metric.value));
    onFCP((metric) => trackMetric('FCP', metric.value));
    onLCP((metric) => trackMetric('LCP', metric.value));
    onTTFB((metric) => trackMetric('TTFB', metric.value));
  });
};

// Analytics tracking - only enable in production and when explicitly enabled
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && 
      window.plausible && 
      import.meta.env.VITE_ANALYTICS_ENABLED === 'true' &&
      import.meta.env.VITE_NODE_ENV === 'production') {
    window.plausible(eventName, { props: properties });
  }
};

// Track tool usage
export const trackToolUsage = (toolName: string, action: 'generate' | 'copy' | 'view') => {
  trackEvent('Tool Usage', {
    tool: toolName,
    action: action,
  });
};

// Track performance metrics
const trackMetric = (name: string, value: number) => {
  trackEvent('Web Vital', {
    metric: name,
    value: Math.round(value),
  });
};

// Track errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('Error', {
    message: error.message,
    context: context || 'Unknown',
    stack: error.stack?.substring(0, 100),
  });
};