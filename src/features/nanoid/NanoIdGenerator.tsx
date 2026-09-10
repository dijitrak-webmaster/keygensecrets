import { useState, useCallback, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { generateNanoId } from '../../lib/crypto';
import {
  CopyButton, OutputSurface, WorkspaceHeader, MetadataRow, RegenerateButton,
  ControlSection, RangeSlider, ToolDocs
} from '../../components/workspace/shared';
import { useKeyboardShortcut } from '../../lib/hooks';

export default function NanoIdGenerator() {
  const [length, setLength] = useState(21);
  const [id, setId] = useState('');

  const regenerate = useCallback(() => { setId(generateNanoId(length)); }, [length]);
  useEffect(() => { regenerate(); }, [length]);
  useKeyboardShortcut('r', false, regenerate);

  return (
    <div className="max-w-3xl mx-auto">
      <WorkspaceHeader icon={Zap} title="NanoID Generator" description="Generate compact, URL-friendly unique identifiers" localOnly />
      <OutputSurface value={id} mono glowOnChange className="mb-5" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <CopyButton value={id} />
        <RegenerateButton onClick={regenerate} />
        <div className="ml-auto">
          <MetadataRow items={[{ label: 'Length', value: String(id.length) }]} />
        </div>
      </div>
      <ControlSection>
        <RangeSlider min={8} max={64} value={length} onChange={setLength} label={`Length: ${length}`} />
      </ControlSection>
      <ToolDocs sections={[
        { title: 'About', content: 'NanoID is a compact, URL-friendly unique identifier generator. The default 21-character ID provides 126 bits of entropy using a 64-character alphabet (A-Za-z0-9_-). NanoIDs are shorter than UUIDs while maintaining comparable collision resistance.' },
        { title: 'Alphabet', content: 'Uses the standard NanoID alphabet: A-Z, a-z, 0-9, underscore, and hyphen (64 characters). All randomness comes from crypto.getRandomValues().' },
      ]} />
    </div>
  );
}
