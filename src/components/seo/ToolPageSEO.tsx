import { useLocation } from 'react-router-dom';
import { tools } from '../../lib/tools/registry';
import { SEO } from './SEO';
import { getToolSEOMetadata } from '../../lib/seo/toolMetadata';

export function ToolPageSEO() {
  const location = useLocation();
  const tool = tools.find(t => t.slug === location.pathname);

  if (!tool) return null;

  const metadata = getToolSEOMetadata(tool);

  return (
    <SEO
      title={metadata.title}
      description={metadata.description}
      canonical={metadata.canonical}
      keywords={metadata.keywords}
    />
  );
}
