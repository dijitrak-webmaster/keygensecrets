import { useState, useCallback, useEffect, useRef } from 'react';
import { KeyRound } from 'lucide-react';
import { generateSecret } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, SegmentedControl, EntropyRail,
  WorkspaceHeader, MetadataRow, RegenerateButton, ControlSection, ControlLabel, ToolDocs, CopyEnvButton
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';

type Format = 'base64url' | 'hex' | 'alphanumeric';
const ENTROPY_OPTIONS = [128, 192, 256, 384, 512];
const FORMAT_OPTIONS: { label: string; value: Format }[] = [
  { label: 'Base64URL', value: 'base64url' },
  { label: 'Hex', value: 'hex' },
  { label: 'Alphanumeric', value: 'alphanumeric' },
];

export default function SecretGenerator() {
  const [bits, setBits] = useState(256);
  const [format, setFormat] = useState<Format>('base64url');
  const [secret, setSecret] = useState(() => generateSecret(256, 'base64url'));
  const [displayText, setDisplayText] = useState(secret);
  const animRef = useRef<number>(0);

  const animateResolve = useCallback((target: string) => {
    cancelAnimationFrame(animRef.current);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=-_';
    const totalFrames = 8;
    let frame = 0;
    const tick = () => {
      frame++;
      if (frame >= totalFrames) { setDisplayText(target); return; }
      const progress = frame / totalFrames;
      const resolved = Math.floor(target.length * progress);
      const scrambled = target.slice(0, resolved) +
        Array.from({ length: target.length - resolved }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      setDisplayText(scrambled);
      animRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const regenerate = useCallback(() => {
    const newSecret = generateSecret(bits, format);
    setSecret(newSecret);
    animateResolve(newSecret);
  }, [bits, format, animateResolve]);

  useEffect(() => { regenerate(); }, [bits, format]);
  useKeyboardShortcut('r', false, regenerate);

  const byteLength = Math.ceil(bits / 8);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={KeyRound} title="Secret Generator" description="Generate cryptographically secure random secrets" localOnly />
      <OutputSurface value={displayText} mono glowOnChange className="mb-5" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={secret} />
        <RegenerateButton onClick={regenerate} />
        <CopyEnvButton envKey="SECRET_KEY" value={secret} />
        <div className="ml-auto">
          <MetadataRow items={[
            { label: 'Bits', value: String(bits) },
            { label: 'Bytes', value: String(byteLength) },
            { label: 'Chars', value: String(secret.length) },
          ]} />
        </div>
      </div>

      <ControlSection>
        <div>
          <ControlLabel>Entropy</ControlLabel>
          <EntropyRail options={ENTROPY_OPTIONS} value={bits} onChange={setBits} />
        </div>
        <div>
          <ControlLabel>Format</ControlLabel>
          <SegmentedControl options={FORMAT_OPTIONS} value={format} onChange={v => setFormat(v as Format)} />
        </div>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About This Tool', content: 'Generates cryptographically secure random secrets using the Web Crypto API (crypto.getRandomValues). Suitable for signing keys, encryption keys, session secrets, and any application requiring high-entropy random data.' },
        { title: 'How It Works', content: 'The browser\'s built-in CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) produces the requested number of random bytes. These bytes are then encoded into the selected output format. No network requests are made — everything runs locally on your device.' },
        { title: 'Security', content: 'All randomness comes from the operating system\'s entropy pool via crypto.getRandomValues(). Generated values are never transmitted, logged, or stored. The character scramble animation is purely visual and uses a separate non-secure random source — the actual secret is generated securely before the animation starts.' },
        { title: 'Usage', content: 'Use 256-bit secrets for most applications including JWT signing (HS256), encryption keys, and API secrets. Use 512-bit for maximum security margin. Base64URL encoding is recommended for most use cases as it is URL-safe and compact. Hex encoding produces longer output but is universally compatible.' },
      ]} />
    </div>
  );
}
