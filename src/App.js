import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuditProvider } from './context/AuditContext';
import { AppRouter } from './components/AppRouter';

function App() {
  return (
    <AuditProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuditProvider>
  );
}

export default App;
