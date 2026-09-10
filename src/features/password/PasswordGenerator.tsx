import { useState, useCallback, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { generatePassword } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, RegenerateButton,
  ControlSection, ControlLabel, StrengthBar, RangeSlider, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

const CHARSETS = [
  { key: 'uppercase' as const, label: 'A–Z', mono: true },
  { key: 'lowercase' as const, label: 'a–z', mono: true },
  { key: 'numbers' as const, label: '0–9', mono: true },
  { key: 'symbols' as const, label: '!@#', mono: true },
];

export default function PasswordGenerator() {
  const [length, setLength] = useState(24);
  const [opts, setOpts] = useState({
    uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false,
  });
  const [password, setPassword] = useState('');

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, opts));
  }, [length, opts]);

  useEffect(() => { regenerate(); }, [length, opts]);
  useKeyboardShortcut('r', false, regenerate);

  const toggle = (key: keyof typeof opts) => {
    setOpts(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) return prev;
      return next;
    });
  };

  let poolSize = 0;
  if (opts.uppercase) poolSize += 26;
  if (opts.lowercase) poolSize += 26;
  if (opts.numbers) poolSize += 10;
  if (opts.symbols) poolSize += 26;
  const entropy = Math.floor(length * Math.log2(poolSize || 1));

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Lock} title="Password Generator" description="Generate strong passwords with configurable character sets" localOnly />
      <OutputSurface value={password} mono glowOnChange className="mb-4" />
      <StrengthBar entropy={entropy} />

      <div className="flex flex-wrap items-center gap-3 mt-5 mb-8">
        <CopyButton value={password} />
        <RegenerateButton onClick={regenerate} />
      </div>

      <ControlSection>
        <RangeSlider min={8} max={128} value={length} onChange={setLength} label={`Length: ${length}`} />

        <div>
          <ControlLabel>Character Sets</ControlLabel>
          <div className="flex flex-wrap gap-2">
            {CHARSETS.map(c => (
              <button key={c.key} onClick={() => toggle(c.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm',
                  opts[c.key]
                    ? 'border-primary/30 bg-primary/10 text-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]'
                )}>
                <span className="font-mono font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => toggle('excludeAmbiguous')}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all',
            opts.excludeAmbiguous ? 'border-primary/30 bg-primary/10 text-foreground' : 'border-border text-muted-foreground'
          )}>
          <div className={cn('w-4 h-4 rounded border-2 transition-all flex items-center justify-center',
            opts.excludeAmbiguous ? 'bg-primary border-primary' : 'border-muted-foreground/30'
          )}>
            {opts.excludeAmbiguous && <span className="text-[10px] text-white font-bold">✓</span>}
          </div>
          Exclude ambiguous characters (O, 0, l, 1, I)
        </button>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About This Tool', content: 'Generates random passwords using the Web Crypto API. All randomness comes from crypto.getRandomValues() — never Math.random(). Passwords are generated locally and never transmitted.' },
        { title: 'Strength', content: 'Password strength depends on length and character pool size. A 24-character password using all character sets provides ~140 bits of entropy, which is considered very strong. The strength indicator shows a practical assessment based on the entropy calculation.' },
      ]} />
    </div>
  );
}
