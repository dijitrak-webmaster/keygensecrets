import { categories, getToolsByCategory, tools, type ToolDef } from '../../lib/tools/registry';
import { Star, Home } from 'lucide-react';
import { cn } from '@project/components';
import { motion } from 'framer-motion';

interface SidebarProps {
  collapsed: boolean;
  activeToolId: string;
  favorites: string[];
  recent: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (slug: string) => void;
  isHome?: boolean;
}

export function Sidebar({ collapsed, activeToolId, favorites, recent, isFavorite, toggleFavorite, onNavigate, isHome }: SidebarProps) {
  const favTools = tools.filter(t => favorites.includes(t.id));
  const recentTools = tools.filter(t => recent.includes(t.id)).slice(0, 5);

  return (
    <nav className={cn(
      'h-full overflow-y-auto py-3 border-r border-border bg-[hsl(var(--surface-0))/0.5] backdrop-blur-md transition-[width] duration-200',
      collapsed ? 'w-14' : 'w-56'
    )}>
      {/* Home link */}
      <div className="px-1.5 mb-2">
        <div className="relative">
          {isHome && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-x-0 inset-y-0 rounded-md bg-[hsl(var(--surface-active))] border border-border/50"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <button
            onClick={() => onNavigate('/')}
            className={cn(
              'relative w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors',
              isHome ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Home' : undefined}
          >
            <Home className={cn('w-4 h-4 shrink-0', isHome && 'text-primary')} />
            {!collapsed && <span className="truncate text-[13px]">Home</span>}
          </button>
        </div>
      </div>
      <div className="mx-3 mb-2 border-t border-border/40" />
      {!collapsed && favTools.length > 0 && (
        <SidebarSection label="Favorites">
          {favTools.map(t => (
            <ToolItem key={t.id} tool={t} active={t.id === activeToolId} collapsed={collapsed}
              isFav={true} toggleFav={() => toggleFavorite(t.id)} onNavigate={() => onNavigate(t.slug)} />
          ))}
        </SidebarSection>
      )}

      {!collapsed && recentTools.length > 0 && (
        <SidebarSection label="Recent">
          {recentTools.map(t => (
            <ToolItem key={t.id} tool={t} active={t.id === activeToolId} collapsed={collapsed}
              isFav={isFavorite(t.id)} toggleFav={() => toggleFavorite(t.id)} onNavigate={() => onNavigate(t.slug)} />
          ))}
        </SidebarSection>
      )}

      {categories.map(cat => (
        <SidebarSection key={cat.id} label={collapsed ? '' : cat.label}>
          {getToolsByCategory(cat.id).map(t => (
            <ToolItem key={t.id} tool={t} active={t.id === activeToolId} collapsed={collapsed}
              isFav={isFavorite(t.id)} toggleFav={() => toggleFavorite(t.id)} onNavigate={() => onNavigate(t.slug)} />
          ))}
        </SidebarSection>
      ))}
    </nav>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      {label && (
        <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function ToolItem({ tool, active, collapsed, isFav, toggleFav, onNavigate }: {
  tool: ToolDef; active: boolean; collapsed: boolean; isFav: boolean; toggleFav: () => void; onNavigate: () => void;
}) {
  const Icon = tool.icon;
  return (
    <div className="relative px-1.5">
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-x-1.5 inset-y-0 rounded-md bg-[hsl(var(--surface-active))] border border-border/50"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <button
        onClick={onNavigate}
        className={cn(
          'relative w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors group',
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]',
          collapsed && 'justify-center px-0'
        )}
        title={collapsed ? tool.name : undefined}
      >
        <Icon className={cn('w-4 h-4 shrink-0', active && 'text-primary')} />
        {!collapsed && (
          <>
            <span className="truncate text-[13px]">{tool.shortName}</span>
            <button
              onClick={e => { e.stopPropagation(); toggleFav(); }}
              className={cn(
                'ml-auto opacity-0 group-hover:opacity-100 transition-opacity',
                isFav && 'opacity-100'
              )}
            >
              <Star className={cn('w-3 h-3', isFav ? 'fill-primary text-primary' : 'text-muted-foreground')} />
            </button>
          </>
        )}
      </button>
    </div>
  );
}
