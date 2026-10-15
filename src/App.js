import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuditProvider, useAudit } from './context/AuditContext';
import { AppRouter } from './components/AppRouter';

function AppThemeSync() {
  const { settings } = useAudit();
  const theme = settings?.theme || 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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
