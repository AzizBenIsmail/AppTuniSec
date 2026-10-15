import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoData } from '../data/demoData';
import { readStoredData, writeStoredData } from '../services/storageService';

const AuditContext = createContext(null);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function AuditProvider({ children }) {
  const [state, setState] = useState(() => readStoredData() ?? demoData);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('tunisec-demo-auth') === 'true');

  useEffect(() => {
    writeStoredData(state);
  }, [state]);

  useEffect(() => {
    localStorage.setItem('tunisec-demo-auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    audits: state.audits || [],
    settings: state.settings || {},
    isAuthenticated,
    loginDemo: () => setIsAuthenticated(true),
    logoutDemo: () => setIsAuthenticated(false),
    setSettings: (nextSettings) => setState((previous) => ({ ...previous, settings: nextSettings })),
    startOnboarding: () => setState((previous) => ({
      ...previous,
      settings: {
        ...(previous.settings || {}),
        onboardingStep: 0,
        onboardingOpen: true,
        onboardingCompleted: false
      }
    })),
    closeOnboarding: () => setState((previous) => ({
      ...previous,
      settings: {
        ...(previous.settings || {}),
        onboardingStep: previous.settings?.onboardingStep ?? 0,
        onboardingOpen: false,
        onboardingCompleted: true
      }
    })),
    createAudit: (newAudit) => {
      setState((previous) => ({
        ...previous,
        audits: [newAudit, ...(previous.audits || [])]
      }));
    },
    updateAudit: (auditId, updater) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).map((audit) => audit.id === auditId ? updater(audit) : audit)
      }));
    },
    deleteAudit: (auditId) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).filter((audit) => audit.id !== auditId)
      }));
    },
    updateChecklistItem: (auditId, itemId, nextStatus) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,
            checklist: (audit.checklist || []).map((item) =>
              item.id === itemId ? { ...item, status: nextStatus } : item
            )
          };
        })
      }));
    },
    addEvidence: (auditId, evidence) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,
            evidence: [evidence, ...(audit.evidence || [])]
          };
        })
      }));
    },
    addFinding: (auditId, finding) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,
            findings: [finding, ...(audit.findings || [])]
          };
        })
      }));
    },
    addAction: (auditId, action) => {
      setState((previous) => ({
        ...previous,
        audits: (previous.audits || []).map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,
            actions: [action, ...(audit.actions || [])]
          };
        })
      }));
    },
    importData: (incoming) => setState((previous) => ({ ...previous, ...incoming })),
    resetData: () => setState({ ...deepClone(demoData) }),
    getAuditById: (auditId) => (state.audits || []).find((audit) => audit.id === auditId)
  }), [isAuthenticated, state]);

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}
