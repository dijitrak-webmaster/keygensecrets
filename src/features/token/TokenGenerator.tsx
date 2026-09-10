import { useState, useCallback, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { generateToken } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, SegmentedControl, WorkspaceHeader, MetadataRow,
  RegenerateButton, ControlSection, RangeSlider, ControlLabel, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';

type Charset = 'alphanumeric' | 'hex' | 'base64url';
const CHARSET_OPTIONS: { label: string; value: Charset }[] = [
  { label: 'Alphanumeric', value: 'alphanumeric' },
  { label: 'Hex', value: 'hex' },
  { label: 'Base64URL', value: 'base64url' },
];

export default function TokenGenerator() {
  const [length, setLength] = useState(32);
  const [charset, setCharset] = useState<Charset>('alphanumeric');
  const [token, setToken] = useState('');

  const regenerate = useCallback(() => { setToken(generateToken(length, charset)); }, [length, charset]);
  useEffect(() => { regenerate(); }, [length, charset]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Shuffle} title="Random Token Generator" description="Generate random tokens of configurable length and format" localOnly />
      <OutputSurface value={token} mono glowOnChange className="mb-5" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={token} />
        <RegenerateButton onClick={regenerate} />
        <div className="ml-auto">
          <MetadataRow items={[{ label: 'Length', value: String(token.length) }]} />
        </div>
      </div>
      <ControlSection>
        <RangeSlider min={8} max={256} value={length} onChange={setLength} label={`Length: ${length}`} />
        <div>
          <ControlLabel>Character Set</ControlLabel>
          <SegmentedControl options={CHARSET_OPTIONS} value={charset} onChange={v => setCharset(v as Charset)} />
        </div>
      </ControlSection>
      <ToolDocs sections={[
        { title: 'About', content: 'Generates random tokens using crypto.getRandomValues(). Useful for CSRF tokens, session identifiers, nonces, verification codes, and any scenario requiring a random string of a specific length.' },
      ]} />
    </div>
  );
}
