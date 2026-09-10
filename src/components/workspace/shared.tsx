import { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, FileText } from 'lucide-react';
import { cn } from '@project/components';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Copy Button ── */
export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(value); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150',
        'border active:scale-[0.97]',
        copied
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'border-border bg-[hsl(var(--surface-2))] text-foreground hover:bg-[hsl(var(--surface-hover))] hover:border-primary/20',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Copied
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ── Regenerate Button ── */
export function RegenerateButton({ onClick, className }: { onClick: () => void; className?: string }) {
  const [spinning, setSpinning] = useState(false);
  const handleClick = () => {
    setSpinning(true);
    onClick();
    setTimeout(() => setSpinning(false), 400);
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium',
        'border border-border bg-[hsl(var(--surface-2))] text-foreground',
        'hover:bg-[hsl(var(--surface-hover))] hover:border-primary/20 active:scale-[0.97] transition-all duration-150',
        className
      )}
    >
      <RefreshCw className={cn('w-3.5 h-3.5 transition-transform duration-400', spinning && 'animate-spin')} />
      Regenerate
      <kbd className="ml-1 px-1 py-0.5 rounded text-[9px] bg-[hsl(var(--surface-3))] text-muted-foreground/50 font-mono">R</kbd>
    </button>
  );
}

/* ── Output Surface (Digital Artifact) ── */
export function OutputSurface({ value, mono, className, glowOnChange }: {
  value: string; mono?: boolean; className?: string; glowOnChange?: boolean;
}) {
  const [glowing, setGlowing] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (glowOnChange && value !== prevValue.current) {
      setGlowing(true);
      const t = setTimeout(() => setGlowing(false), 500);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value, glowOnChange]);

  return (
    <div className={cn(
      'relative rounded-xl border overflow-hidden transition-all duration-300',
      glowing ? 'border-primary/40 shadow-[0_0_20px_hsl(345_82%_60%/0.1)]' : 'border-border',
      'bg-[hsl(var(--surface-0))]',
      className
    )}>
      {/* Top edge glow */}
      <div className={cn(
        'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-300',
        glowing ? 'opacity-100' : 'opacity-40'
      )} />
      {/* Content */}
      <div className="p-5 md:p-6">
        <div className={cn(
          'text-base md:text-xl break-all leading-relaxed select-all',
          mono && 'font-mono tracking-wider'
        )}>
          {value || <span className="text-muted-foreground/30">Generating...</span>}
        </div>
      </div>
      {/* Bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </div>
  );
}

/* ── Segmented Control ── */
export function SegmentedControl<T extends string>({ options, value, onChange, className }: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = options.findIndex(o => o.value === value);
    const btn = container.children[idx + 1] as HTMLElement;
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value, options]);

  return (
    <div ref={containerRef} className={cn('relative inline-flex rounded-lg bg-[hsl(var(--surface-1))] border border-border p-0.5', className)}>
      <div
        className="absolute top-0.5 h-[calc(100%-4px)] rounded-md bg-primary/15 border border-primary/20 transition-all duration-200 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'relative z-10 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors',
            value === opt.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Entropy Rail ── */
export function EntropyRail({ options, value, onChange }: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  const idx = options.indexOf(value);
  const pct = options.length > 1 ? (idx / (options.length - 1)) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="relative h-10 flex items-center px-1">
        {/* Track */}
        <div className="absolute inset-x-1 h-[3px] bg-border/60 rounded-full">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        {/* Dots */}
        {options.map((opt, i) => {
          const pos = options.length > 1 ? (i / (options.length - 1)) * 100 : 0;
          const active = opt === value;
          const passed = i <= idx;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="absolute -translate-x-1/2 flex flex-col items-center group z-10"
              style={{ left: `calc(${pos}% + ${pos === 0 ? 4 : pos === 100 ? -4 : 0}px)` }}
            >
              <motion.div
                animate={{
                  scale: active ? 1.3 : 1,
                  backgroundColor: active ? 'hsl(345 82% 60%)' : passed ? 'hsl(345 82% 60% / 0.4)' : 'hsl(220 14% 18%)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'w-3 h-3 rounded-full border-2 transition-shadow',
                  active ? 'border-primary shadow-[0_0_10px_hsl(345_82%_60%/0.5)]' : 'border-transparent'
                )}
              />
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono px-1">
        {options.map(opt => (
          <span key={opt} className={cn(opt === value && 'text-primary font-semibold')}>{opt}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Workspace Header ── */
export function WorkspaceHeader({ icon: Icon, title, description, localOnly }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  localOnly?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      {localOnly && <SecurityBadge />}
    </div>
  );
}

/* ── Security Badge with popover ── */
function SecurityBadge() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden sm:block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        LOCAL
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-[hsl(var(--surface-1))] border border-border shadow-xl z-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-foreground">Generated on this device</span>
            </div>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>• Web Crypto API (crypto.getRandomValues)</li>
              <li>• Not transmitted to any server</li>
              <li>• Not stored in browser storage</li>
              <li>• No telemetry or logging of values</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Metadata Row ── */
export function MetadataRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="text-muted-foreground/40 uppercase tracking-wider text-[10px]">{item.label}</span>
          <span className="font-mono text-muted-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Control Section ── */
export function ControlSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-6 rounded-xl border border-border bg-[hsl(var(--surface-0))/0.5] backdrop-blur-sm p-5', className)}>
      {children}
    </div>
  );
}

export function ControlLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">{children}</label>;
}

/* ── Strength Bar ── */
export function StrengthBar({ entropy }: { entropy: number }) {
  const level = entropy < 60 ? 0 : entropy < 80 ? 1 : entropy < 120 ? 2 : 3;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn(
            'h-1 flex-1 rounded-full transition-all duration-300',
            i <= level ? colors[level] : 'bg-border'
          )} />
        ))}
      </div>
      <div className="flex justify-between text-[10px]">
        <span className={cn('font-medium', level >= 2 ? 'text-emerald-400' : level === 1 ? 'text-orange-400' : 'text-red-400')}>
          {labels[level]}
        </span>
        <span className="text-muted-foreground/50 font-mono">~{entropy} bits</span>
      </div>
    </div>
  );
}

/* ── Copy as .env Button ── */
export function CopyEnvButton({ envKey, value, className }: { envKey: string; value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `${envKey}="${value}"`;
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(snippet); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [snippet]);

  return (
    <button
      onClick={handleCopy}
      title={`Copy as ${envKey}="..."`}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
        'border active:scale-[0.97]',
        copied
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'border-border bg-[hsl(var(--surface-2))] text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))] hover:border-primary/20',
        className
      )}
    >
      <FileText className="w-3.5 h-3.5" />
      {copied ? 'Copied .env' : '.env'}
    </button>
  );
}

/* ── Tool Info / Documentation Section ── */
export function ToolDocs({ sections }: { sections: { title: string; content: string }[] }) {
  return (
    <div className="mt-10 space-y-6 border-t border-border pt-8">
      {sections.map((s, i) => (
        <div key={i}>
          <h2 className="text-sm font-semibold text-foreground mb-2">{s.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Range Slider ── */
export function RangeSlider({ min, max, value, onChange, label }: {
  min: number; max: number; value: number; onChange: (v: number) => void; label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      {label && <ControlLabel>{label}: {value}</ControlLabel>}
      <div className="relative h-8 flex items-center">
        <div className="absolute inset-x-0 h-[3px] bg-border/60 rounded-full">
          <div className="absolute h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(+e.target.value)}
          className="absolute inset-x-0 w-full h-8 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-primary border-2 border-primary shadow-[0_0_8px_hsl(345_82%_60%/0.4)] pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}
