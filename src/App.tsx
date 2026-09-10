document.documentElement.classList.add('dark');

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppShell } from './components/app-shell/AppShell';
import { tools } from './lib/tools/registry';
import { lazy } from 'react';
import { ToolPageSEO } from './components/seo/ToolPageSEO';

const HomePage = lazy(() => import('./features/home/HomePage'));

function AppRoutes() {
  const location = useLocation();
  const isToolPage = tools.some(t => t.slug === location.pathname);

  return (
    <>
      {isToolPage && <ToolPageSEO />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {tools.map(tool => (
          <Route key={tool.id} path={tool.slug} element={<tool.component />} />
        ))}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}
