import { useState, useEffect } from 'react';
import { Hash as HashIcon } from 'lucide-react';
import { computeHash } from '../../lib/crypto';
import { CopyButton, WorkspaceHeader, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

const ALGORITHMS = [
  { id: 'SHA-1', label: 'SHA-1', warn: true },
  { id: 'SHA-256', label: 'SHA-256', warn: false },
  { id: 'SHA-384', label: 'SHA-384', warn: false },
  { id: 'SHA-512', label: 'SHA-512', warn: false },
];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (!input) { setHash(''); return; }
    let cancelled = false;
    computeHash(algo, input).then(h => { if (!cancelled) setHash(h); });
    return () => { cancelled = true; };
  }, [input, algo]);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={HashIcon} title="Hash Generator" description="Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes" localOnly />

      <div className="grid gap-4 md:grid-cols-2 mb-5">
        {/* Source pane */}
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Source</div>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste or type content..."
            className="w-full h-44 md:h-60 px-4 py-3 bg-transparent text-sm font-mono text-foreground resize-none outline-none placeholder:text-muted-foreground/20" />
        </div>

        {/* Output pane */}
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">{algo} Output</span>
            {hash && <CopyButton value={hash} className="scale-90 !py-1 !px-2.5" />}
          </div>
          <div className="px-4 py-3 h-44 md:h-60 overflow-auto">
            {hash ? (
              <code className="text-sm font-mono break-all select-all leading-relaxed tracking-wide">{hash}</code>
            ) : (
              <span className="text-sm text-muted-foreground/20 italic">Hash will appear here...</span>
            )}
          </div>
        </div>
      </div>

      <ControlSection>
        <ControlLabel>Algorithm</ControlLabel>
        <div className="flex flex-wrap gap-1.5">
          {ALGORITHMS.map(a => (
            <button key={a.id} onClick={() => setAlgo(a.id)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                algo === a.id ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground',
                a.warn && algo === a.id && 'border-orange-500/30 bg-orange-500/5')}>
              {a.label}
            </button>
          ))}
        </div>
        {algo === 'SHA-1' && (
          <p className="text-xs text-orange-400/70">⚠ SHA-1 is cryptographically weak. Use SHA-256+ for security-sensitive applications.</p>
        )}
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'Computes cryptographic hash digests using the Web Crypto API (SubtleCrypto.digest). The hash is computed locally in your browser. Hashing is a one-way function — you cannot recover the original input from the hash.' },
        { title: 'Algorithms', content: 'SHA-256 is recommended for most uses. SHA-512 provides a larger output. SHA-1 is legacy and should only be used for compatibility with older systems. All hashing runs through the browser\'s native crypto.subtle.digest() implementation.' },
      ]} />
    </div>
  );
}
