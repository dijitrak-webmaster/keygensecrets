import { useState, useMemo } from 'react';
import { Braces, Copy, Check, Minimize2, Maximize2 } from 'lucide-react';
import { WorkspaceHeader, ControlSection, ControlLabel, SegmentedControl, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

type Indent = '2' | '4' | 'tab';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<Indent>('2');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null, stats: null };
    try {
      const parsed = JSON.parse(input);
      const space = indent === 'tab' ? '\t' : +indent;
      const output = JSON.stringify(parsed, null, space);
      const stats = getStats(parsed);
      return { output, error: null, stats };
    } catch (e: any) {
      return { output: '', error: e.message as string, stats: null };
    }
  }, [input, indent]);

  const minify = () => {
    if (!input.trim()) return;
    try {
      setInput(JSON.stringify(JSON.parse(input)));
    } catch { /* noop */ }
  };

  const prettify = () => {
    if (!input.trim()) return;
    try {
      const space = indent === 'tab' ? '\t' : +indent;
      setInput(JSON.stringify(JSON.parse(input), null, space));
    } catch { /* noop */ }
  };

  const copy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Braces} title="JSON Formatter" description="Format, validate and minify JSON data" localOnly />

      <div className="grid gap-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <ControlLabel>Input</ControlLabel>
            <div className="flex gap-1.5">
              <button onClick={prettify} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-all">
                <Maximize2 className="w-3 h-3" /> Prettify
              </button>
              <button onClick={minify} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-all">
                <Minimize2 className="w-3 h-3" /> Minify
              </button>
            </div>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={8}
            className={cn(
              'w-full rounded-lg border bg-[hsl(var(--surface-0))] px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 outline-none transition-colors resize-y',
              result.error ? 'border-destructive/50 focus:border-destructive' : 'border-border focus:border-primary/30'
            )}
          />
          {result.error && <p className="text-xs text-destructive mt-1">{result.error}</p>}
        </div>

        {result.output && (
          <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-[hsl(var(--surface-1))]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Valid JSON</span>
                {result.stats && (
                  <span className="text-[10px] text-muted-foreground/40 font-mono">
                    {result.stats.keys} keys · {result.stats.depth} depth · {result.output.length} chars
                  </span>
                )}
              </div>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <><Check className="w-3 h-3 text-primary" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto select-all text-foreground/80 max-h-[400px] overflow-y-auto">{result.output}</pre>
          </div>
        )}
      </div>

      <ControlSection>
        <ControlLabel>Indentation</ControlLabel>
        <SegmentedControl options={[
          { label: '2 spaces', value: '2' as Indent },
          { label: '4 spaces', value: '4' as Indent },
          { label: 'Tab', value: 'tab' as Indent },
        ]} value={indent} onChange={v => setIndent(v as Indent)} />
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'Formats, validates and minifies JSON data entirely in your browser. Paste any JSON to see it prettified with syntax validation. Useful for debugging API responses, config files, and data structures.' },
      ]} />
    </div>
  );
}

function getStats(obj: unknown, depth = 0): { keys: number; depth: number } {
  if (obj === null || typeof obj !== 'object') return { keys: 0, depth };
  if (Array.isArray(obj)) {
    let maxDepth = depth + 1;
    let keys = 0;
    for (const item of obj) {
      const s = getStats(item, depth + 1);
      keys += s.keys;
      maxDepth = Math.max(maxDepth, s.depth);
    }
    return { keys, depth: maxDepth };
  }
  let maxDepth = depth + 1;
  let keys = Object.keys(obj).length;
  for (const val of Object.values(obj)) {
    const s = getStats(val, depth + 1);
    keys += s.keys;
    maxDepth = Math.max(maxDepth, s.depth);
  }
  return { keys, depth: maxDepth };
}
