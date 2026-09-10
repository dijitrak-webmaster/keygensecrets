import { useState, useCallback, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { generateTotpSecret, buildTotpUri } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, RegenerateButton,
  ControlSection, ControlLabel, SegmentedControl, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

type SecretLength = '16' | '20' | '32';
const LENGTH_OPTIONS: { label: string; value: SecretLength }[] = [
  { label: '16 chars', value: '16' },
  { label: '20 chars', value: '20' },
  { label: '32 chars', value: '32' },
];

export default function TotpSecretGenerator() {
  const [length, setLength] = useState<SecretLength>('32');
  const [issuer, setIssuer] = useState('MyApp');
  const [account, setAccount] = useState('user@example.com');
  const [secret, setSecret] = useState(() => generateTotpSecret(32));

  const regenerate = useCallback(() => {
    setSecret(generateTotpSecret(Number(length)));
  }, [length]);

  useEffect(() => { regenerate(); }, [length]);
  useKeyboardShortcut('r', false, regenerate);

  const uri = buildTotpUri(secret, issuer, account);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={ShieldCheck} title="TOTP Secret Generator" description="Generate Base32 secrets for two-factor authentication" localOnly />

      <OutputSurface value={secret} mono glowOnChange className="mb-5" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={secret} />
        <RegenerateButton onClick={regenerate} />
      </div>

      <ControlSection>
        <div>
          <ControlLabel>Secret Length</ControlLabel>
          <SegmentedControl options={LENGTH_OPTIONS} value={length} onChange={v => setLength(v as SecretLength)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <ControlLabel>Issuer</ControlLabel>
            <input value={issuer} onChange={e => setIssuer(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-[hsl(var(--surface-1))] text-sm text-foreground outline-none focus:border-primary/30 transition-colors" />
          </div>
          <div>
            <ControlLabel>Account</ControlLabel>
            <input value={account} onChange={e => setAccount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-[hsl(var(--surface-1))] text-sm text-foreground outline-none focus:border-primary/30 transition-colors" />
          </div>
        </div>

        <div>
          <ControlLabel>OTPAuth URI</ControlLabel>
          <div className="relative rounded-lg border border-border bg-[hsl(var(--surface-0))] p-3">
            <code className="text-[11px] font-mono text-muted-foreground break-all select-all leading-relaxed">{uri}</code>
            <div className="absolute top-2 right-2">
              <CopyButton value={uri} className="!py-1 !px-2 !text-[10px]" />
            </div>
          </div>
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'Generates Base32-encoded secrets compatible with TOTP authenticator apps (Google Authenticator, Authy, 1Password, etc.). The secret is used to generate time-based one-time passwords per RFC 6238.' },
        { title: 'Usage', content: 'Copy the secret into your application\'s 2FA setup. The OTPAuth URI can be encoded as a QR code for users to scan. 32-character secrets (160 bits) are recommended for maximum security.' },
      ]} />
    </div>
  );
}
