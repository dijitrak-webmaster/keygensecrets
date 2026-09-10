import { useState, useCallback } from 'react';
import { KeyRound, Copy, Check, Loader2 } from 'lucide-react';
import { generateRsaKeyPair } from '../../lib/crypto';
import { WorkspaceHeader, SegmentedControl, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

type Bits = '2048' | '4096';

export default function RsaKeyPairGenerator() {
  const [bits, setBits] = useState<Bits>('2048');
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'public' | 'private'>('public');

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const kp = await generateRsaKeyPair(+bits as 2048 | 4096);
      setKeys(kp);
    } finally { setLoading(false); }
  }, [bits]);

  const currentKey = keys ? (tab === 'public' ? keys.publicKey : keys.privateKey) : '';

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={KeyRound} title="RSA Key Pair Generator" description="Generate RSA public/private key pairs using Web Crypto" localOnly />

      <ControlSection className="mb-6">
        <ControlLabel>Key Size</ControlLabel>
        <SegmentedControl options={[{ label: '2048-bit', value: '2048' as Bits }, { label: '4096-bit', value: '4096' as Bits }]} value={bits} onChange={v => setBits(v as Bits)} />
        <button onClick={generate} disabled={loading}
          className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all',
            'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50')}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Key Pair'}
        </button>
      </ControlSection>

      {keys && (
        <>
          <SegmentedControl options={[{ label: 'Public Key', value: 'public' as const }, { label: 'Private Key', value: 'private' as const }]} value={tab} onChange={v => setTab(v as 'public' | 'private')} className="mb-4" />
          <KeyOutput value={currentKey} />
        </>
      )}

      <ToolDocs sections={[
        { title: 'About', content: 'Generates RSA key pairs using the Web Crypto API (RSASSA-PKCS1-v1_5). Keys are exported in PEM format (SPKI for public, PKCS8 for private). Everything runs locally — private keys never leave your device.' },
        { title: 'Usage', content: '2048-bit keys are suitable for most applications. 4096-bit keys provide stronger security but take longer to generate. Use the public key for verification/encryption and the private key for signing/decryption.' },
      ]} />
    </div>
  );
}

function KeyOutput({ value }: { value: string }) {
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
