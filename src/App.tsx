document.documentElement.classList.add('dark');

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/app-shell/AppShell';
import { tools } from './lib/tools/registry';
import { lazy } from 'react';

const HomePage = lazy(() => import('./features/home/HomePage'));

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {tools.map(tool => (
            <Route key={tool.id} path={tool.slug} element={<tool.component />} />
          ))}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
