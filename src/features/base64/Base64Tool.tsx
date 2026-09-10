import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { base64Encode, base64Decode } from '../../lib/crypto';
import { CopyButton, WorkspaceHeader, ControlSection, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  let output = '';
  if (input) {
    try {
      output = mode === 'encode' ? base64Encode(input) : base64Decode(input);
      if (error) setError('');
    } catch (e: any) {
      if (!error) setError(e.message || 'Invalid input');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={ArrowLeftRight} title="Base64 Encode / Decode" description="Encode and decode Base64 with full UTF-8 support" localOnly />

      {/* Mode */}
      <div className="flex items-center gap-2 mb-5">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setError(''); }}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all border',
              mode === m ? 'bg-primary/10 border-primary/30 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
        <div className="ml-auto text-[11px] text-muted-foreground/40">
          Base64 is encoding, <strong className="text-muted-foreground/60">not</strong> encryption
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-5">
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
            {mode === 'encode' ? 'Plain Text' : 'Base64 Input'}
          </div>
          <textarea value={input} onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder={mode === 'encode' ? 'Type or paste text...' : 'Paste Base64 string...'}
            className="w-full h-48 px-4 py-3 bg-transparent text-sm font-mono text-foreground resize-none outline-none placeholder:text-muted-foreground/20" />
        </div>
        <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
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
        { title: 'About', content: 'Encodes and decodes Base64 with full UTF-8 support. Base64 is a binary-to-text encoding scheme that represents binary data as ASCII characters. It is commonly used in data URLs, email attachments, and embedding binary data in JSON/XML.' },
        { title: 'Security Note', content: 'Base64 is NOT encryption. It is a reversible encoding that provides no security. Anyone with the Base64 string can decode it. Do not use Base64 to "hide" sensitive data.' },
      ]} />
    </div>
  );
}
