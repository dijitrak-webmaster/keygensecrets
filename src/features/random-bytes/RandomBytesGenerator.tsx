import { useState, useCallback, useEffect } from 'react';
import { Binary } from 'lucide-react';
import { generateRandomBytesHex, generateRandomBytesBase64 } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, MetadataRow, RegenerateButton,
  ControlSection, ControlLabel, RangeSlider, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

export default function RandomBytesGenerator() {
  const [byteCount, setByteCount] = useState(32);
  const [format, setFormat] = useState<'hex' | 'base64'>('hex');
  const [output, setOutput] = useState('');

  const regenerate = useCallback(() => {
    setOutput(format === 'hex' ? generateRandomBytesHex(byteCount) : generateRandomBytesBase64(byteCount));
  }, [byteCount, format]);

  useEffect(() => { regenerate(); }, [byteCount, format]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Binary} title="Random Bytes Generator" description="Generate cryptographically secure random bytes" localOnly />
      <OutputSurface value={output} mono glowOnChange className="mb-5" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={output} />
        <RegenerateButton onClick={regenerate} />
        <div className="ml-auto">
          <MetadataRow items={[{ label: 'Bytes', value: String(byteCount) }, { label: 'Bits', value: String(byteCount * 8) }]} />
        </div>
      </div>
      <ControlSection>
        <RangeSlider min={4} max={128} value={byteCount} onChange={setByteCount} label={`Byte Count: ${byteCount}`} />
        <div>
          <ControlLabel>Format</ControlLabel>
          <div className="flex gap-1.5">
            {(['hex', 'base64'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                  format === f ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground')}>
                {f === 'hex' ? 'Hex' : 'Base64'}
              </button>
            ))}
          </div>
        </div>
      </ControlSection>
      <ToolDocs sections={[
        { title: 'About', content: 'Generates raw random bytes using crypto.getRandomValues() and encodes them as hex or Base64. Useful for cryptographic seeds, initialization vectors, nonces, and other raw entropy needs.' },
      ]} />
    </div>
  );
}
