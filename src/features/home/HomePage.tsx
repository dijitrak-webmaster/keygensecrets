import { tools, categories, getToolsByCategory } from '../../lib/tools/registry';
import { useNavigate } from 'react-router-dom';
import { cn } from '@project/components';
import { motion } from 'framer-motion';
import { Search, Sparkles, Shield, Zap, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? tools.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.some(k => k.includes(search.toLowerCase()))
      )
    : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-primary/80 bg-primary/5 border border-primary/10 mb-4">
            <Sparkles className="w-3 h-3" />
            All generation happens locally via Web Crypto API
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="text-foreground">Developer </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Crypto Toolkit</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {tools.length} free tools to generate secrets, keys, tokens, hashes, and encode data — all client-side, nothing leaves your device.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          className="flex justify-center gap-6 md:gap-10 mt-6 mb-6">
          {[
            { icon: Zap, label: 'Tools', value: tools.length, color: 'text-primary' },
            { icon: Shield, label: 'Client-Side', value: '100%', color: 'text-emerald-400' },
            { icon: WifiOff, label: 'Network Calls', value: '0', color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className={cn('w-4 h-4', stat.color)} />
              <div className="text-left">
                <div className="text-lg font-bold text-foreground leading-none">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-border bg-[hsl(var(--surface-0))] text-sm text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-primary/30 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] bg-[hsl(var(--surface-2))] text-muted-foreground/50 font-mono">
            ⌘K
          </kbd>
        </motion.div>
      </div>

      {/* Filtered results */}
      {filtered ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground/40 py-10">No tools match "{search}"</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} onNavigate={() => navigate(tool.slug)} />
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat, ci) => {
            const catTools = getToolsByCategory(cat.id);
            const CatIcon = cat.icon;
            return (
              <motion.section key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + ci * 0.08 }}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <CatIcon className="w-3.5 h-3.5 text-primary/60" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{cat.label}</h2>
                  <span className="text-[10px] text-muted-foreground/30 font-mono">{catTools.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i} onNavigate={() => navigate(tool.slug)} />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      )}

      {/* Bottom hint */}
      <div className="mt-8 mb-4 text-center text-[11px] text-muted-foreground/30">
        Press <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--surface-2))] text-muted-foreground/50 font-mono">⌘K</kbd> to quickly jump to any tool
        {' · '}
        Press <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--surface-2))] text-muted-foreground/50 font-mono">?</kbd> for keyboard shortcuts
      </div>
    </div>
  );
}

function ToolCard({ tool, index, onNavigate }: { tool: typeof tools[0]; index: number; onNavigate: () => void }) {
  const Icon = tool.icon;
  return (
    <motion.button onClick={onNavigate} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
      className="group text-left w-full p-4 rounded-xl border border-border bg-[hsl(var(--surface-0))/0.5] backdrop-blur-sm hover:border-primary/20 hover:bg-[hsl(var(--surface-1))] transition-all duration-200 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/20 to-transparent transition-all duration-300" />
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary/10 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors truncate">{tool.shortName}</div>
          <div className="text-[11px] text-muted-foreground/50 mt-0.5 line-clamp-2 leading-relaxed">{tool.description}</div>
        </div>
      </div>
    </motion.button>
  );
}
