import { motion, AnimatePresence } from 'framer-motion';

const shortcuts = [
  { keys: ['⌘', 'K'], desc: 'Open command palette' },
  { keys: ['R'], desc: 'Regenerate current output' },
  { keys: ['?'], desc: 'Show this cheatsheet' },
  { keys: ['Esc'], desc: 'Close overlay' },
];

export function ShortcutSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-0 flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-sm mx-4 bg-[hsl(var(--surface-1))] border border-border/60 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Keyboard Shortcuts</h2>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-[hsl(var(--surface-3))] text-muted-foreground/40 font-mono">esc</kbd>
              </div>
              <div className="p-3 space-y-1">
                {shortcuts.map(s => (
                  <div key={s.desc} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                    <span className="text-sm text-foreground/80">{s.desc}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map(k => (
                        <kbd key={k} className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-[hsl(var(--surface-3))] text-muted-foreground border border-border/50 min-w-[26px] text-center">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
