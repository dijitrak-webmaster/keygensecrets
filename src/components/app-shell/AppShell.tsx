import { type ReactNode, Suspense, useState, useCallback, useEffect } from 'react';
import { AnimatedBackground } from '../background/AnimatedBackground';
import { Sidebar } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { CommandPalette } from '../navigation/CommandPalette';
import { ShortcutSheet } from '../navigation/ShortcutSheet';
import { SeoFooter } from '../seo/SeoFooter';
import { AdSlot } from '../ads/AdSlot';
import { useSidebarState, useFavorites, useRecent } from '../../lib/hooks';
import { usePageSeo } from '../../lib/seo';
import { useLocation, useNavigate } from 'react-router-dom';
import { tools } from '../../lib/tools/registry';
import { AnimatePresence, motion } from 'framer-motion';

export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed, toggleSidebar } = useSidebarState();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recent, addRecent } = useRecent();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);

  const activeTool = tools.find(t => t.slug === location.pathname);
  const isHome = location.pathname === '/';

  // Dynamic SEO per page
  usePageSeo();

  useEffect(() => {
    if (activeTool) addRecent(activeTool.id);
    // Scroll to top on route change
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [activeTool?.id, location.pathname]);

  // ⌘K + ? global handlers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      const target = e.target as HTMLElement;
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
        e.preventDefault();
        setShortcutOpen(prev => !prev);
      }
      if (e.key === 'Escape' && shortcutOpen) {
        setShortcutOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcutOpen]);

  const handleNavigate = useCallback((slug: string) => {
    navigate(slug);
    setCmdOpen(false);
    setMobileNav(false);
  }, [navigate]);

  return (
    <div className="h-full relative">
      <AnimatedBackground />

      <div className="relative h-full flex flex-col" style={{ zIndex: 2 }}>
        <TopBar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          openCmd={() => setCmdOpen(true)}
          openMobileNav={() => setMobileNav(true)}
          activeTool={activeTool}
        />

        <div className="flex flex-1 min-h-0">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar
              collapsed={collapsed}
              activeToolId={activeTool?.id || ''}
              favorites={favorites}
              recent={recent}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              onNavigate={handleNavigate}
              isHome={isHome}
            />
          </div>

          {/* Mobile nav overlay */}
          <AnimatePresence>
            {mobileNav && (
              <div className="fixed inset-0 z-50 md:hidden">
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setMobileNav(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  className="absolute left-0 top-0 bottom-0 w-72 bg-[hsl(var(--surface-0))] border-r border-border"
                >
                  <div className="p-4 border-b border-border">
                    <span className="font-bold text-sm tracking-tight">
                      <span className="text-foreground">KeyGen</span>
                      <span className="text-primary">Secrets</span>
                    </span>
                  </div>
                  <Sidebar
                    collapsed={false}
                    activeToolId={activeTool?.id || ''}
                    favorites={favorites}
                    recent={recent}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    onNavigate={handleNavigate}
                    isHome={isHome}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Workspace with transition */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="p-3 md:p-6 lg:p-8">
              <Suspense fallback={<WorkspaceSkeleton />}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {children}

                    {/* Ad slot below tool content */}
                    {activeTool && (
                      <div className="mt-10 max-w-3xl mx-auto">
                        <AdSlot variant="banner" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </div>

            {/* SEO footer with internal links */}
            <SeoFooter />
          </main>
        </div>

        {/* Status bar */}
        <div className="hidden md:flex items-center h-7 px-4 border-t border-border text-[11px] text-muted-foreground gap-4 shrink-0 bg-[hsl(var(--surface-0))/0.6] backdrop-blur-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Local Generation
          </span>
          <span>Web Crypto API</span>
          {activeTool && <span className="text-muted-foreground/40">•</span>}
          {activeTool && <span className="text-muted-foreground/60">{activeTool.name}</span>}
          <span className="ml-auto">{tools.length} tools · v2.0</span>
        </div>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={handleNavigate}
        recent={recent}
        favorites={favorites}
      />
      <ShortcutSheet open={shortcutOpen} onClose={() => setShortcutOpen(false)} />
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="h-32 bg-muted rounded-xl" />
      <div className="h-16 bg-muted rounded-xl" />
    </div>
  );
}
