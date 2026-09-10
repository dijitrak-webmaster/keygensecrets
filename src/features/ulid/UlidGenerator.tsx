import { useState, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { generateUlid } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, RegenerateButton,
  ControlSection, ControlLabel, MetadataRow, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';

export default function UlidGenerator() {
  const [count, setCount] = useState(1);
  const [ulids, setUlids] = useState(() => [generateUlid()]);

  const regenerate = useCallback(() => {
    setUlids(Array.from({ length: count }, () => generateUlid()));
  }, [count]);

  useKeyboardShortcut('r', false, regenerate);

  const handleCountChange = (n: number) => {
    setCount(n);
    setUlids(Array.from({ length: n }, () => generateUlid()));
  };

  const display = ulids.join('\n');
  const timestamp = ulids[0] ? decodeUlidTimestamp(ulids[0]) : '';

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Clock} title="ULID Generator" description="Generate Universally Unique Lexicographically Sortable Identifiers" localOnly />

      <OutputSurface value={display} mono glowOnChange className="mb-5" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={display} />
        <RegenerateButton onClick={regenerate} />
        <div className="ml-auto">
          <MetadataRow items={[
            { label: 'Chars', value: '26' },
            { label: 'Timestamp', value: timestamp },
          ]} />
        </div>
      </div>

      <ControlSection>
        <div>
          <ControlLabel>Count</ControlLabel>
          <div className="flex gap-2">
            {[1, 5, 10, 25].map(n => (
              <button key={n} onClick={() => handleCountChange(n)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  count === n
                    ? 'bg-primary/10 border-primary/30 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'ULID (Universally Unique Lexicographically Sortable Identifier) is a 128-bit identifier that encodes a Unix timestamp in the first 48 bits and 80 bits of randomness. ULIDs are Crockford Base32 encoded into 26 characters.' },
        { title: 'Advantages over UUID', content: 'ULIDs are lexicographically sortable by creation time, making them excellent for database primary keys. They are more compact than UUIDv4 (26 chars vs 36), naturally ordered, and still globally unique.' },
      ]} />
    </div>
  );
}

function decodeUlidTimestamp(ulid: string): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let time = 0;
  for (let i = 0; i < 10; i++) {
    time = time * 32 + ENCODING.indexOf(ulid[i]);
  }
  try {
    return new Date(time).toISOString().slice(0, 19).replace('T', ' ');
  } catch {
    return '—';
  }
}
