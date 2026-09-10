import { useState } from 'react';
import { Link } from 'lucide-react';
import { urlEncode, urlDecode } from '../../lib/crypto';
import { CopyButton, WorkspaceHeader, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

export default function UrlTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  let output = '';
  if (input) {
    try {
      output = mode === 'encode' ? urlEncode(input) : urlDecode(input);
      if (error) setError('');
    } catch (e: any) {
      if (!error) setError(e.message || 'Invalid input');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Link} title="URL Encode / Decode" description="Encode and decode URL components" localOnly />

      <div className="flex items-center gap-2 mb-5">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setError(''); }}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all border',
              mode === m ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-5">
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
            {mode === 'encode' ? 'Plain Text' : 'URL-Encoded Input'}
          </div>
          <textarea value={input} onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder={mode === 'encode' ? 'Type or paste text...' : 'Paste URL-encoded string...'}
            className="w-full h-48 px-4 py-3 bg-transparent text-sm font-mono text-foreground resize-none outline-none placeholder:text-muted-foreground/20" />
        </div>
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
              {mode === 'encode' ? 'Encoded Output' : 'Decoded Text'}
            </span>
            {output && <CopyButton value={output} className="scale-90 !py-1 !px-2.5" />}
          </div>
          <div className="px-4 py-3 h-48 overflow-auto">
            {error ? <span className="text-sm text-destructive">{error}</span>
              : output ? <code className="text-sm font-mono break-all select-all leading-relaxed">{output}</code>
              : <span className="text-sm text-muted-foreground/20 italic">Output will appear here...</span>}
          </div>
        </div>
      </div>

      <ToolDocs sections={[
        { title: 'About', content: 'Encodes and decodes URL components using encodeURIComponent/decodeURIComponent. Special characters are replaced with percent-encoded sequences (e.g., space becomes %20). Essential for building query strings and working with URLs that contain special characters.' },
      ]} />
    </div>
  );
}
