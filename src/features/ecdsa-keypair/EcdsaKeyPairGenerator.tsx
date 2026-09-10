import { useState, useCallback } from 'react';
import { KeyRound, Copy, Check, Loader2 } from 'lucide-react';
import { generateEcKeyPair } from '../../lib/crypto';
import { WorkspaceHeader, SegmentedControl, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

type Curve = 'P-256' | 'P-384' | 'P-521';

export default function EcdsaKeyPairGenerator() {
  const [curve, setCurve] = useState<Curve>('P-256');
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'public' | 'private'>('public');

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const kp = await generateEcKeyPair(curve);
      setKeys(kp);
    } finally { setLoading(false); }
  }, [curve]);

  const currentKey = keys ? (tab === 'public' ? keys.publicKey : keys.privateKey) : '';

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={KeyRound} title="ECDSA Key Pair Generator" description="Generate elliptic curve key pairs for signing" localOnly />

      <ControlSection className="mb-6">
        <ControlLabel>Curve</ControlLabel>
        <SegmentedControl options={[
          { label: 'P-256', value: 'P-256' as Curve },
          { label: 'P-384', value: 'P-384' as Curve },
          { label: 'P-521', value: 'P-521' as Curve },
        ]} value={curve} onChange={v => setCurve(v as Curve)} />
        <button onClick={generate} disabled={loading}
          className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all',
            'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50')}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Key Pair'}
        </button>
      </ControlSection>

      {keys && (
        <>
          <SegmentedControl options={[{ label: 'Public Key', value: 'public' as const }, { label: 'Private Key', value: 'private' as const }]} value={tab} onChange={v => setTab(v as 'public' | 'private')} className="mb-4" />
          <KeyBlock value={currentKey} />
        </>
      )}

      <ToolDocs sections={[
        { title: 'About', content: 'Generates ECDSA (Elliptic Curve Digital Signature Algorithm) key pairs using the Web Crypto API. Keys are exported in PEM format. ECDSA keys are much smaller than RSA keys but provide equivalent security.' },
        { title: 'Curves', content: 'P-256 (secp256r1) is the most widely used and is recommended for most applications. P-384 and P-521 provide stronger security at the cost of larger key sizes. All three are NIST standard curves.' },
      ]} />
    </div>
  );
}

function KeyBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-[hsl(var(--surface-1))]">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">PEM</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <><Check className="w-3 h-3 text-primary" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto select-all text-foreground/80 whitespace-pre-wrap break-all">{value}</pre>
    </div>
  );
}
