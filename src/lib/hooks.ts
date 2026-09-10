import { useState, useCallback, useEffect } from 'react';

const FAV_KEY = 'kgs_favorites';
const RECENT_KEY = 'kgs_recent';
const SIDEBAR_KEY = 'kgs_sidebar';
const MAX_RECENT = 8;

function readJson<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => readJson(FAV_KEY, []));
  const toggle = useCallback((id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { favorites: favs, toggleFavorite: toggle, isFavorite: (id: string) => favs.includes(id) };
}

export function useRecent() {
  const [recent, setRecent] = useState<string[]>(() => readJson(RECENT_KEY, []));
  const addRecent = useCallback((id: string) => {
    setRecent(prev => {
      const next = [id, ...prev.filter(r => r !== id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { recent, addRecent };
}

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(() => readJson(SIDEBAR_KEY, false));
  const toggle = useCallback(() => {
    setCollapsed((prev: boolean) => {
      localStorage.setItem(SIDEBAR_KEY, JSON.stringify(!prev));
      return !prev;
    });
  }, []);
  return { collapsed, toggleSidebar: toggle };
}

export function useKeyboardShortcut(key: string, meta: boolean, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() === key.toLowerCase()) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, meta, callback]);
}
