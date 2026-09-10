import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { computeHmac } from '../../lib/crypto';
import { CopyButton, WorkspaceHeader, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];

export default function HmacGenerator() {
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [hmac, setHmac] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!key || !message) { setHmac(''); setError(''); return; }
    let cancelled = false;
    computeHmac(algo, key, message)
      .then(h => { if (!cancelled) { setHmac(h); setError(''); } })
      .catch(e => { if (!cancelled) { setHmac(''); setError(e.message); } });
    return () => { cancelled = true; };
  }, [key, message, algo]);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Shield} title="HMAC Generator" description="Compute HMAC message authentication codes" localOnly />

      <div className="grid gap-4 md:grid-cols-2 mb-5">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Secret Key</div>
            <textarea value={key} onChange={e => setKey(e.target.value)} placeholder="Enter HMAC key..."
              className="w-full h-24 px-4 py-3 bg-transparent text-sm font-mono text-foreground resize-none outline-none placeholder:text-muted-foreground/20" />
          </div>
          <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Message</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message to sign..."
              className="w-full h-32 px-4 py-3 bg-transparent text-sm font-mono text-foreground resize-none outline-none placeholder:text-muted-foreground/20" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">HMAC-{algo}</span>
            {hmac && <CopyButton value={hmac} className="scale-90 !py-1 !px-2.5" />}
          </div>
          <div className="px-4 py-3 h-full min-h-[200px] overflow-auto">
            {error ? <span className="text-sm text-destructive">{error}</span>
              : hmac ? <code className="text-sm font-mono break-all select-all leading-relaxed tracking-wide">{hmac}</code>
              : <span className="text-sm text-muted-foreground/20 italic">HMAC will appear here...</span>}
          </div>
        </div>
      </div>

      <ControlSection>
        <ControlLabel>Algorithm</ControlLabel>
        <div className="flex flex-wrap gap-1.5">
          {ALGORITHMS.map(a => (
            <button key={a} onClick={() => setAlgo(a)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                algo === a ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
              {a}
            </button>
          ))}
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function to produce a message authentication code. It verifies both data integrity and authenticity. Computed locally using SubtleCrypto.sign().' },
      ]} />
    </div>
  );
}
