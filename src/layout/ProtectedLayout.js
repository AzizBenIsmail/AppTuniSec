import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { OnboardingGuide } from '../components/OnboardingGuide';
import { useAudit } from '../context/AuditContext';
import { Sidebar } from './Sidebar';

export function ProtectedLayout() {
  const { isAuthenticated, settings } = useAudit();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const shouldShowOnboarding = settings?.onboardingOpen === true || settings?.onboardingCompleted !== true;

  return (
    <div className={`app-shell app-shell--${settings?.theme || 'dark'}`}>
      <Sidebar />
      <main className="main-panel">
        <Outlet />
      </main>
      {shouldShowOnboarding && <OnboardingGuide />}
    </div>
  );
}
