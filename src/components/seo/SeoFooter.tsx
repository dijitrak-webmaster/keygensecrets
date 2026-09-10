import { Link } from 'react-router-dom';
import { tools, categories, getToolsByCategory } from '../../lib/tools/registry';

export function SeoFooter() {
  return (
    <footer className="border-t border-border/40 bg-[hsl(var(--surface-0))/0.3] mt-12">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Brand row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="font-bold text-lg tracking-tight">
              <span className="text-foreground">KeyGen</span>
              <span className="text-primary">Secrets</span>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-1 max-w-sm">
              Free, open developer crypto toolkit. All generation happens locally in your browser using the Web Crypto API. Nothing is ever transmitted or stored.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Client-Side • No Tracking • No Cookies
          </div>
        </div>

        {/* Tool links grid — internal linking for SEO */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 mb-8">
          {categories.map(cat => (
            <div key={cat.id}>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-2">{cat.label}</h3>
              <ul className="space-y-1">
                {getToolsByCategory(cat.id).map(tool => (
                  <li key={tool.id}>
                    <Link
                      to={tool.slug}
                      className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SEO text block */}
        <div className="text-[11px] text-muted-foreground/30 leading-relaxed mb-6 max-w-3xl">
          <p>
            KeyGenSecrets provides {tools.length} free online developer tools for generating cryptographic secrets, keys, tokens, passwords, and encoding data.
            All tools use the Web Crypto API (crypto.getRandomValues) for cryptographically secure randomness.
            No data is transmitted to any server — everything runs 100% in your browser.
            Perfect for generating JWT secrets, API keys, encryption keys, TOTP 2FA secrets, UUIDs, ULIDs, NanoIDs, and more.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground/25">
            © {new Date().getFullYear()} KeyGenSecrets. Free to use. No account required.
          </span>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/25">
            <span>Web Crypto API</span>
            <span>•</span>
            <span>Open Source Algorithms</span>
            <span>•</span>
            <span>Zero Dependencies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
