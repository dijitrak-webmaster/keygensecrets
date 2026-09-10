import { useState } from 'react';
import { FileSearch } from 'lucide-react';
import { decodeJwt } from '../../lib/crypto';
import { WorkspaceHeader, ControlSection, ControlLabel, ToolDocs } from '../../components/workspace/shared';
import { cn } from '@project/components';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const decoded = token.trim() ? decodeJwt(token.trim()) : null;
  const hasInput = token.trim().length > 0;
  const isValid = hasInput && decoded !== null;

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={FileSearch} title="JWT Decoder" description="Decode and inspect JSON Web Token header and payload" localOnly />

      <ControlSection className="mb-6">
        <ControlLabel>Paste JWT Token</ControlLabel>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
          rows={3}
          className="w-full rounded-lg border border-border bg-[hsl(var(--surface-0))] px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/30 transition-colors resize-none"
        />
        {hasInput && !isValid && (
          <p className="text-xs text-destructive mt-1">Invalid JWT format — must have 3 Base64URL-encoded parts separated by dots</p>
        )}
      </ControlSection>

      {decoded && (
        <div className="space-y-4">
          <JsonPanel label="Header" data={decoded.header} color="text-sky-400" />
          <JsonPanel label="Payload" data={decoded.payload} />
          <SignaturePanel signature={decoded.signature} />
        </div>
      )}

      <ToolDocs sections={[
        { title: 'About', content: 'Decodes JSON Web Tokens (JWT) by base64url-decoding the header and payload segments. This tool does NOT verify signatures — it only inspects the token contents. Everything runs locally in your browser.' },
        { title: 'Security Note', content: 'JWTs are base64-encoded, not encrypted. Anyone with the token can read its contents. Never put sensitive data in a JWT payload. This tool can help you inspect what data a JWT carries and verify claims like expiration (exp), issuer (iss), and subject (sub).' },
      ]} />
    </div>
  );
}

function JsonPanel({ label, data, color }: { label: string; data: Record<string, unknown>; color?: string }) {
  const formatted = JSON.stringify(data, null, 2);
  const entries = Object.entries(data);

  return (
    <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border/50 bg-[hsl(var(--surface-1))]">
        <span className={cn('text-xs font-semibold uppercase tracking-wider', color || 'text-primary')}>{label}</span>
      </div>
      <div className="p-4 space-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-3">
            <span className="text-xs font-mono text-muted-foreground/60 shrink-0">{k}</span>
            <span className="text-sm font-mono text-foreground break-all">
              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
              {k === 'exp' && typeof v === 'number' && (
                <span className="ml-2 text-xs text-muted-foreground/50">
                  ({new Date(v * 1000).toISOString()})
                  {v * 1000 < Date.now() && <span className="ml-1 text-destructive">expired</span>}
                </span>
              )}
              {k === 'iat' && typeof v === 'number' && (
                <span className="ml-2 text-xs text-muted-foreground/50">({new Date(v * 1000).toISOString()})</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignaturePanel({ signature }: { signature: string }) {
  return (
    <div className="rounded-xl border border-border bg-[hsl(var(--surface-0))] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border/50 bg-[hsl(var(--surface-1))]">
        <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Signature</span>
      </div>
      <div className="p-4">
        <code className="text-xs font-mono text-muted-foreground break-all">{signature}</code>
        <p className="text-[11px] text-muted-foreground/40 mt-2">Signature verification is not performed — this tool only decodes the token.</p>
      </div>
    </div>
  );
}
