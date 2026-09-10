import { Search, PanelLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ToolDef } from '../../lib/tools/registry';

interface TopBarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  openCmd: () => void;
  openMobileNav: () => void;
  activeTool?: ToolDef;
}

export function TopBar({ collapsed, toggleSidebar, openCmd, openMobileNav, activeTool }: TopBarProps) {
  const navigate = useNavigate();
  return (
    <header className="h-12 shrink-0 flex items-center px-3 md:px-4 border-b border-border bg-[hsl(var(--surface-0))/0.6] backdrop-blur-md gap-3">
      {/* Mobile menu */}
      <button onClick={openMobileNav} className="md:hidden p-1.5 rounded-md hover:bg-[hsl(var(--surface-hover))] text-muted-foreground">
        <Menu className="w-4 h-4" />
      </button>

      {/* Desktop sidebar toggle */}
      <button onClick={toggleSidebar} className="hidden md:flex p-1.5 rounded-md hover:bg-[hsl(var(--surface-hover))] text-muted-foreground">
        <PanelLeft className="w-4 h-4" />
      </button>

      {/* Brand — links to home */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="font-bold text-sm tracking-tight">
          <span className="text-foreground">KeyGen</span>
          <span className="text-primary">Secrets</span>
        </span>
      </button>

      {activeTool && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-border">/</span>
          <span className="text-foreground/70">{activeTool.name}</span>
        </div>
      )}

      {/* Search trigger */}
      <button
        onClick={openCmd}
        className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-[hsl(var(--surface-1))] hover:bg-[hsl(var(--surface-hover))] text-muted-foreground text-xs transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search tools...</span>
        <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 rounded text-[10px] bg-[hsl(var(--surface-3))] text-muted-foreground/70 font-mono">
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
