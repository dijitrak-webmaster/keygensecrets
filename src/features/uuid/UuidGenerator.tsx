import { useState, useCallback } from 'react';
import { Fingerprint, Copy, Check, RefreshCw } from 'lucide-react';
import { generateUUIDs } from '../../lib/crypto';
import { WorkspaceHeader, RegenerateButton, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>(() => generateUUIDs(1));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const regenerate = useCallback(() => { setUuids(generateUUIDs(count)); }, [count]);
  useKeyboardShortcut('r', false, regenerate);

  const copyOne = async (uuid: string, idx: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };
  const handleCountChange = (n: number) => { setCount(n); setUuids(generateUUIDs(n)); };

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Fingerprint} title="UUID Generator" description="Generate RFC 4122 compliant v4 UUIDs" localOnly />

      {/* Output list */}
      <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden mb-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        {uuids.map((uuid, i) => (
          <div key={i} className={cn('flex items-center gap-3 px-5 py-3 group', i > 0 && 'border-t border-border/50')}>
            {count > 1 && <span className="text-[10px] text-muted-foreground/30 font-mono w-5 text-right">{i + 1}</span>}
            <code className="flex-1 font-mono text-sm md:text-base select-all break-all tracking-wide">{uuid}</code>
            <button onClick={() => copyOne(uuid, i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-[hsl(var(--surface-hover))]">
              {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button onClick={copyAll}
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all active:scale-[0.97]',
            copiedAll ? 'bg-primary/10 text-primary border-primary/30' : 'border-border bg-[hsl(var(--surface-2))] text-foreground hover:bg-[hsl(var(--surface-hover))]'
          )}>
          {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedAll ? 'Copied All' : 'Copy All'}
        </button>
        <RegenerateButton onClick={regenerate} />
      </div>

      <ControlSection>
        <ControlLabel>Batch Size</ControlLabel>
        <div className="flex flex-wrap gap-1.5">
          {[1, 5, 10, 25, 50].map(n => (
            <button key={n} onClick={() => handleCountChange(n)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                count === n ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
              {n}
            </button>
          ))}
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'Generates version 4 UUIDs using crypto.randomUUID(). Each UUID is a 128-bit identifier represented as 32 hexadecimal digits in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where the 4 indicates version 4 and y is one of 8, 9, a, or b.' },
      ]} />
    </div>
  );
}
