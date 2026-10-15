import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { ProtectedLayout } from '../layout/ProtectedLayout';
import { AuditWorkspacePage } from '../pages/AuditWorkspacePage';
import { AuditsPage } from '../pages/AuditsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { NewAuditPage } from '../pages/NewAuditPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/SettingsPage';

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
