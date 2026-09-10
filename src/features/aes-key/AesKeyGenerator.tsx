import { useState, useCallback, useEffect } from 'react';
import { KeyRound } from 'lucide-react';
import { generateSecret } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, MetadataRow, RegenerateButton,
  ControlSection, ControlLabel, ToolDocs, CopyEnvButton
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

const KEY_SIZES = [
  { bits: 128, label: 'AES-128', desc: '128-bit key' },
  { bits: 192, label: 'AES-192', desc: '192-bit key' },
  { bits: 256, label: 'AES-256', desc: '256-bit key (recommended)' },
];

export default function AesKeyGenerator() {
  const [size, setSize] = useState(256);
  const [format, setFormat] = useState<'base64url' | 'hex'>('base64url');
  const [key, setKey] = useState('');

  const regenerate = useCallback(() => { setKey(generateSecret(size, format)); }, [size, format]);
  useEffect(() => { regenerate(); }, [size, format]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={KeyRound} title="AES Key Generator" description="Generate AES encryption keys" localOnly />
      <OutputSurface value={key} mono glowOnChange className="mb-5" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={key} />
        <RegenerateButton onClick={regenerate} />
        <CopyEnvButton envKey="AES_KEY" value={key} />
        <div className="ml-auto">
          <MetadataRow items={[{ label: 'Bits', value: String(size) }, { label: 'Bytes', value: String(size / 8) }]} />
        </div>
      </div>
      <ControlSection>
        <div>
          <ControlLabel>Key Size</ControlLabel>
          <div className="flex flex-col gap-2">
            {KEY_SIZES.map(k => (
              <button key={k.bits} onClick={() => setSize(k.bits)}
                className={cn('flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left',
                  size === k.bits ? 'border-primary/30 bg-primary/10' : 'border-border hover:bg-[hsl(var(--surface-hover))]')}>
                <div className={cn('w-2.5 h-2.5 rounded-full', size === k.bits ? 'bg-primary' : 'bg-muted-foreground/20')} />
                <div>
                  <div className="text-sm font-medium">{k.label}</div>
                  <div className="text-xs text-muted-foreground">{k.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <ControlLabel>Format</ControlLabel>
          <div className="flex gap-1.5">
            {(['base64url', 'hex'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                  format === f ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground')}>
                {f === 'base64url' ? 'Base64URL' : 'Hex'}
              </button>
            ))}
          </div>
        </div>
      </ControlSection>
      <ToolDocs sections={[
        { title: 'About', content: 'Generates random keys suitable for AES (Advanced Encryption Standard) symmetric encryption. AES-256 is recommended for most applications and provides the highest security margin.' },
      ]} />
    </div>
  );
}
