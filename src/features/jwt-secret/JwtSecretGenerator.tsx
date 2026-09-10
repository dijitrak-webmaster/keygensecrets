import { useState, useCallback, useEffect } from 'react';
import { FileKey } from 'lucide-react';
import { generateSecret } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, MetadataRow, RegenerateButton,
  ControlSection, ControlLabel, ToolDocs, CopyEnvButton
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

const ALGORITHMS = [
  { id: 'HS256', bits: 256, desc: 'HMAC-SHA256 — 256-bit key (recommended)' },
  { id: 'HS384', bits: 384, desc: 'HMAC-SHA384 — 384-bit key' },
  { id: 'HS512', bits: 512, desc: 'HMAC-SHA512 — 512-bit key' },
] as const;

export default function JwtSecretGenerator() {
  const [algo, setAlgo] = useState<(typeof ALGORITHMS)[number]>(ALGORITHMS[0]);
  const [format, setFormat] = useState<'base64url' | 'hex'>('base64url');
  const [secret, setSecret] = useState('');

  const regenerate = useCallback(() => { setSecret(generateSecret(algo.bits, format)); }, [algo, format]);
  useEffect(() => { regenerate(); }, [algo, format]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={FileKey} title="JWT Secret Generator" description="Generate HMAC signing secrets for JSON Web Tokens" localOnly />
      <OutputSurface value={secret} mono glowOnChange className="mb-5" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={secret} />
        <RegenerateButton onClick={regenerate} />
        <CopyEnvButton envKey="JWT_SECRET" value={secret} />
        <div className="ml-auto">
          <MetadataRow items={[
            { label: 'Algo', value: algo.id },
            { label: 'Bits', value: String(algo.bits) },
            { label: 'Bytes', value: String(algo.bits / 8) },
          ]} />
        </div>
      </div>
      <ControlSection>
        <div>
          <ControlLabel>Algorithm</ControlLabel>
          <div className="flex flex-col gap-2">
            {ALGORITHMS.map(a => (
              <button key={a.id} onClick={() => setAlgo(a)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left',
                  algo.id === a.id ? 'border-primary/30 bg-primary/10' : 'border-border hover:bg-[hsl(var(--surface-hover))]'
                )}>
                <div className={cn('w-2.5 h-2.5 rounded-full transition-colors', algo.id === a.id ? 'bg-primary' : 'bg-muted-foreground/20')} />
                <div>
                  <div className="text-sm font-medium">{a.id}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <ControlLabel>Output Format</ControlLabel>
          <div className="flex gap-1.5">
            {(['base64url', 'hex'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                  format === f ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                )}>
                {f === 'base64url' ? 'Base64URL' : 'Hex'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[hsl(var(--surface-1))] border border-border text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground/80">Note:</strong> This generates symmetric HMAC signing secrets for HS256/HS384/HS512 algorithms. RSA (RS256) and ECDSA (ES256) use asymmetric key pairs, not shared secrets.
        </div>
      </ControlSection>
      <ToolDocs sections={[
        { title: 'About', content: 'Generates HMAC signing secrets for JWT (JSON Web Token) authentication. The secret is used with the HS256, HS384, or HS512 algorithms to sign and verify tokens.' },
        { title: 'Usage', content: 'Copy the generated secret and use it as your JWT_SECRET environment variable. HS256 with a 256-bit key is sufficient for most applications. Use HS512 if you want a higher security margin.' },
      ]} />
    </div>
  );
}
