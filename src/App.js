import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuditProvider, useAudit } from './context/AuditContext';
import { AppRouter } from './components/AppRouter';
import { getLanguageDirection } from './i18n';

function AppThemeSync() {
  const { settings } = useAudit();
  const theme = settings?.theme || 'dark';
  const language = settings?.language || 'fr';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguageDirection(language);
  }, [theme, language]);

  return null;
}

function App() {
  return (
    <AuditProvider>
      <AppThemeSync />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuditProvider>
  );
}

export default App;
