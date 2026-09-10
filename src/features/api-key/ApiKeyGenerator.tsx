import { useState, useCallback, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { generateApiKey } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, SegmentedControl, WorkspaceHeader, MetadataRow,
  RegenerateButton, ControlSection, ControlLabel, RangeSlider, ToolDocs, CopyEnvButton
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

type Format = 'base64url' | 'hex' | 'alphanumeric';
const PREFIXES = [
  { value: 'sk_live_', label: 'sk_live_' },
  { value: 'sk_test_', label: 'sk_test_' },
  { value: 'pk_live_', label: 'pk_live_' },
  { value: 'pk_test_', label: 'pk_test_' },
  { value: 'api_', label: 'api_' },
  { value: '', label: 'Custom' },
];
const FORMAT_OPTIONS: { label: string; value: Format }[] = [
  { label: 'Base64URL', value: 'base64url' },
  { label: 'Hex', value: 'hex' },
  { label: 'Alphanumeric', value: 'alphanumeric' },
];

export default function ApiKeyGenerator() {
  const [prefix, setPrefix] = useState('sk_live_');
  const [customPrefix, setCustomPrefix] = useState('');
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<Format>('alphanumeric');
  const [key, setKey] = useState('');

  const actualPrefix = prefix === '' ? customPrefix : prefix;

  const regenerate = useCallback(() => {
    setKey(generateApiKey(actualPrefix, length, format));
  }, [actualPrefix, length, format]);

  useEffect(() => { regenerate(); }, [actualPrefix, length, format]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Code2} title="API Key Generator" description="Generate structured API key credentials with prefixes" localOnly />
      <OutputSurface value={key} mono glowOnChange className="mb-5" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={key} />
        <RegenerateButton onClick={regenerate} />
        <CopyEnvButton envKey="API_KEY" value={key} />
        <div className="ml-auto">
          <MetadataRow items={[
            { label: 'Prefix', value: actualPrefix || 'none' },
            { label: 'Total', value: String(key.length) },
          ]} />
        </div>
      </div>

      <ControlSection>
        <div>
          <ControlLabel>Prefix</ControlLabel>
          <div className="flex flex-wrap gap-1.5">
            {PREFIXES.map(p => (
              <button key={p.value} onClick={() => setPrefix(p.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-mono transition-all border',
                  prefix === p.value ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]'
                )}>
                {p.label}
              </button>
            ))}
          </div>
          {prefix === '' && (
            <input value={customPrefix}
              onChange={e => setCustomPrefix(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              placeholder="my_prefix_"
              className="mt-3 w-full max-w-xs px-3 py-2 rounded-lg bg-[hsl(var(--surface-1))] border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/30 transition-colors"
            />
          )}
        </div>
        <RangeSlider min={16} max={64} value={length} onChange={setLength} label={`Random Length: ${length} bytes`} />
        <div>
          <ControlLabel>Format</ControlLabel>
          <SegmentedControl options={FORMAT_OPTIONS} value={format} onChange={v => setFormat(v as Format)} />
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About This Tool', content: 'Generates random API-key-style credentials with configurable prefixes. This tool does NOT provision real credentials for any external service — it generates random strings formatted like common API keys.' },
        { title: 'Prefix Conventions', content: 'sk_ (secret key) and pk_ (publishable key) are common conventions from Stripe and similar APIs. _live_ and _test_ distinguish production from development environments. Custom prefixes let you match your own API\'s naming convention.' },
      ]} />
    </div>
  );
}
