import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { AuditWorkspacePage } from './AuditWorkspacePage';
import { AuditsPage } from './AuditsPage';
import { DashboardPage } from './DashboardPage';
import { LoginPage } from './LoginPage';
import { NewAuditPage } from './NewAuditPage';
import { NotFoundPage } from './NotFoundPage';
import { ProtectedLayout } from './ProtectedLayout';
import { SettingsPage } from './SettingsPage';

export function AppRouter() {
  const { isAuthenticated } = useAudit();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/audits" element={<AuditsPage />} />
        <Route path="/audits/new" element={<NewAuditPage />} />
        <Route path="/audits/:auditId" element={<AuditWorkspacePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
