import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getStructuredData } from '../../lib/seo';

const SCRIPT_ID = 'kgs-jsonld';

export function StructuredData() {
  const location = useLocation();

  useEffect(() => {
    const data = getStructuredData(location.pathname);
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (data) {
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    } else if (script) {
      script.remove();
    }
  }, [location.pathname]);

  return null;
}
