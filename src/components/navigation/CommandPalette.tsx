import { useState, useEffect, useRef, useCallback } from 'react';
import { tools, searchTools, type ToolDef } from '../../lib/tools/registry';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@project/components';
import { Search } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
  recent: string[];
  favorites: string[];
}

export function CommandPalette({ open, onClose, onNavigate, recent }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const results = query ? searchTools(query) : [];
  const recentTools = recent.map(id => tools.find(t => t.id === id)).filter(Boolean) as ToolDef[];
  const displayList = query ? results : recentTools.length > 0 ? recentTools : tools;

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[selectedIdx] as HTMLElement;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && displayList[selectedIdx]) {
      onNavigate(displayList[selectedIdx].slug);
    }
  }, [displayList, selectedIdx, onNavigate]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-0 flex items-start justify-center pt-[12vh] sm:pt-[15vh]" onClick={e => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-lg mx-4 bg-[hsl(var(--surface-1))] border border-border/60 rounded-xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Top glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <Search className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tools and actions..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-[hsl(var(--surface-3))] text-muted-foreground/40 font-mono">esc</kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto py-1.5">
                {!query && recentTools.length > 0 && (
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                    Recent
                  </div>
                )}
                {!query && recentTools.length === 0 && (
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                    All Tools
                  </div>
                )}
                {displayList.map((tool, idx) => {
                  const Icon = tool.icon;
                  const selected = idx === selectedIdx;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onNavigate(tool.slug)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative',
                        selected ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {selected && (
                        <motion.div layoutId="cmd-highlight" className="absolute inset-x-1 inset-y-0 rounded-lg bg-[hsl(var(--surface-hover))]"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                      )}
                      <Icon className={cn('w-4 h-4 shrink-0 relative z-10', selected && 'text-primary')} />
                      <span className="truncate relative z-10">{tool.name}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground/30 capitalize relative z-10">{tool.category}</span>
                    </button>
                  );
                })}
                {query && results.length === 0 && (
                  <div className="px-4 py-10 text-center text-sm text-muted-foreground/40">
                    No tools found for "{query}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
