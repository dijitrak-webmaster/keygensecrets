import { useState, useEffect } from 'react';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';
import { WorkspaceHeader, ControlSection, ControlLabel, SegmentedControl, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

type Mode = 'now' | 'custom';

export default function TimestampConverter() {
  const [mode, setMode] = useState<Mode>('now');
  const [now, setNow] = useState(Date.now());
  const [customInput, setCustomInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live clock
  useEffect(() => {
    if (mode !== 'now') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [mode]);

  const ts = mode === 'now' ? now : parseInput(customInput);
  const valid = ts !== null;
  const date = valid ? new Date(ts) : null;

  const rows = valid && date ? [
    { label: 'Unix (seconds)', value: Math.floor(ts / 1000).toString() },
    { label: 'Unix (milliseconds)', value: ts.toString() },
    { label: 'ISO 8601', value: date.toISOString() },
    { label: 'UTC', value: date.toUTCString() },
    { label: 'Local', value: date.toLocaleString() },
    { label: 'Relative', value: relativeTime(ts) },
  ] : [];

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Clock} title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates" localOnly />

      <ControlSection className="mb-6">
        <SegmentedControl options={[{ label: 'Live Now', value: 'now' as Mode }, { label: 'Custom Input', value: 'custom' as Mode }]} value={mode} onChange={v => setMode(v as Mode)} />

        {mode === 'custom' && (
          <div>
            <ControlLabel>Enter timestamp or date string</ControlLabel>
            <input value={customInput} onChange={e => setCustomInput(e.target.value)}
              placeholder="1694352000 or 2024-01-15T12:00:00Z"
              className="w-full rounded-lg border border-border bg-[hsl(var(--surface-0))] px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/30 transition-colors"
            />
            {customInput && !valid && <p className="text-xs text-destructive mt-1">Cannot parse input — try a Unix timestamp or ISO date</p>}
          </div>
        )}

        {mode === 'now' && (
          <button onClick={() => setNow(Date.now())} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        )}
      </ControlSection>

      {rows.length > 0 && (
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden mb-6">
          {rows.map((row, i) => (
            <div key={row.label} className={cn('flex items-center gap-4 px-5 py-3 group', i > 0 && 'border-t border-border/50')}>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold w-32 shrink-0">{row.label}</span>
              <code className="flex-1 text-sm font-mono text-foreground select-all break-all">{row.value}</code>
              <button onClick={() => copy(row.label, row.value)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-[hsl(var(--surface-hover))]">
                {copiedKey === row.label ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <ToolDocs sections={[
        { title: 'About', content: 'Converts between Unix timestamps (seconds and milliseconds since epoch) and human-readable date formats including ISO 8601, UTC, and your local timezone. All conversions happen client-side.' },
        { title: 'Supported Inputs', content: 'Enter a Unix timestamp in seconds (10 digits) or milliseconds (13 digits), or any valid date string (ISO 8601, RFC 2822, etc.). The tool automatically detects the format.' },
      ]} />
    </div>
  );
}

function parseInput(input: string): number | null {
  const s = input.trim();
  if (!s) return null;
  // Try as number (unix ts)
  if (/^\d{10}$/.test(s)) return +s * 1000;
  if (/^\d{13}$/.test(s)) return +s;
  // Try as date string
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.getTime();
}

function relativeTime(ts: number): string {
  const diff = ts - Date.now();
  const abs = Math.abs(diff);
  const suffix = diff < 0 ? 'ago' : 'from now';
  if (abs < 60000) return `${Math.floor(abs / 1000)}s ${suffix}`;
  if (abs < 3600000) return `${Math.floor(abs / 60000)}m ${suffix}`;
  if (abs < 86400000) return `${Math.floor(abs / 3600000)}h ${suffix}`;
  return `${Math.floor(abs / 86400000)}d ${suffix}`;
}
