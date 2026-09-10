import { useState, useCallback, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { generatePassphrase } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, RegenerateButton,
  ControlSection, ControlLabel, StrengthBar, SegmentedControl, RangeSlider, ToolDocs, CopyEnvButton
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';
import { cn } from '@project/components';

type Sep = '-' | '.' | '_' | ' ';

export default function PassphraseGenerator() {
  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState<Sep>('-');
  const [capitalize, setCapitalize] = useState(true);
  const [passphrase, setPassphrase] = useState('');

  const regenerate = useCallback(() => {
    setPassphrase(generatePassphrase(wordCount, separator, capitalize));
  }, [wordCount, separator, capitalize]);

  useEffect(() => { regenerate(); }, [wordCount, separator, capitalize]);
  useKeyboardShortcut('r', false, regenerate);

  // ~10.7 bits per word from 1024-word list
  const entropy = Math.floor(wordCount * 10.7);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={BookOpen} title="Passphrase Generator" description="Generate memorable, high-entropy word-based passphrases" localOnly />
      <OutputSurface value={passphrase} mono={false} glowOnChange className="mb-4" />
      <StrengthBar entropy={entropy} />

      <div className="flex flex-wrap items-center gap-3 mt-5 mb-8">
        <CopyButton value={passphrase} />
        <RegenerateButton onClick={regenerate} />
        <CopyEnvButton envKey="PASSPHRASE" value={passphrase} />
      </div>

      <ControlSection>
        <RangeSlider min={3} max={12} value={wordCount} onChange={setWordCount} label={`Words: ${wordCount}`} />

        <div>
          <ControlLabel>Separator</ControlLabel>
          <div className="flex flex-wrap gap-2">
            {([
              { label: 'Hyphen (-)', value: '-' as Sep },
              { label: 'Dot (.)', value: '.' as Sep },
              { label: 'Underscore (_)', value: '_' as Sep },
              { label: 'Space', value: ' ' as Sep },
            ]).map(s => (
              <button key={s.value} onClick={() => setSeparator(s.value)}
                className={cn('px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                  separator === s.value ? 'border-primary/30 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setCapitalize(c => !c)}
          className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all',
            capitalize ? 'border-primary/30 bg-primary/10 text-foreground' : 'border-border text-muted-foreground')}>
          <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
            capitalize ? 'bg-primary border-primary' : 'border-muted-foreground/30')}>
            {capitalize && <span className="text-[10px] text-white font-bold">✓</span>}
          </div>
          Capitalize words
        </button>
      </ControlSection>

      <ToolDocs sections={[
        { title: 'About', content: 'Generates random passphrases by selecting words from a curated 1024-word list using cryptographically secure random numbers. Passphrases are easier to remember than random character strings while maintaining high entropy.' },
        { title: 'Strength', content: 'Each word adds ~10.7 bits of entropy. A 5-word passphrase provides ~53 bits, suitable for most online accounts. For high-security applications (master passwords, encryption keys), use 7+ words for 75+ bits of entropy.' },
      ]} />
    </div>
  );
}
