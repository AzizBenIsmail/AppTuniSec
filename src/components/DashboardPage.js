import React, { useMemo } from 'react';
import { useAudit } from '../context/AuditContext';
import { calculateComplianceStats } from '../services/auditService';
import { SectionCard, StatCard, StatusBadge } from './shared/ui';

export function DashboardPage() {
  const { audits } = useAudit();

  const stats = useMemo(() => {
    const totalProjects = audits.length;
    const auditsInProgress = audits.filter((audit) => audit.status === 'En cours').length;
    const completedAudits = audits.filter((audit) => audit.status === 'Terminé').length;
    const nonConformities = audits.reduce(
      (total, audit) => total + (calculateComplianceStats(audit)['Non conforme'] || 0),
      0
    );
    const highRisk = audits.reduce((total, audit) => {
      const findings = audit.findings || [];
      return total + findings.filter((finding) => ['Élevé', 'Critique'].includes(finding.riskLevel)).length;
    }, 0);
    const pendingActions = audits.reduce(
      (total, audit) => total + (audit.actions || []).filter((action) => action.status !== 'Terminé').length,
      0
    );
    const compliances = audits.map((audit) => calculateComplianceStats(audit));
    const averageCompliance = compliances.length
      ? Math.round(
          compliances.reduce((total, stat) => total + (stat['Conforme'] || 0), 0) /
            compliances.reduce((total, stat) => total + Object.values(stat).reduce((sum, value) => sum + value, 0), 0) *
            100
        )
      : 0;

    return { totalProjects, auditsInProgress, completedAudits, nonConformities, highRisk, pendingActions, averageCompliance };
  }, [audits]);

  const recentActivity = [...audits]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 4);

  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">Résumé exécutif</span>
        <h1>Tableau de bord</h1>
      </div>
      <button className="button button-primary" onClick={() => window.location.assign('/audits/new')}>
        Créer un audit
      </button>

      <div className="stats-grid">
        <StatCard label="Projets d’audit" value={stats.totalProjects} accent="blue" />
        <StatCard label="Audits en cours" value={stats.auditsInProgress} accent="teal" />
        <StatCard label="Audits terminés" value={stats.completedAudits} accent="green" />
        <StatCard label="Conformité globale" value={`${stats.averageCompliance}%`} accent="orange" />
        <StatCard label="Non-conformités" value={stats.nonConformities} accent="red" />
        <StatCard label="Constats à risque" value={stats.highRisk} accent="purple" />
        <StatCard label="Actions correctives" value={stats.pendingActions} accent="yellow" />
      </div>

      <div className="two-column-layout">
        <SectionCard title="Activité récente" className="panel-surface">
          {recentActivity.map((audit) => (
            <div key={audit.id} className="activity-row">
              <div>
                <strong>{audit.title}</strong>
                <small>{audit.organizationName}</small>
              </div>
              <StatusBadge status={audit.status} />
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Répartition du statut" className="panel-surface">
          {['Conforme', 'Partiellement conforme', 'Non conforme', 'À vérifier', 'Non applicable'].map((status) => {
            const total = audits.reduce((sum, audit) => sum + (calculateComplianceStats(audit)[status] || 0), 0);
            const percentage = audits.length && total
              ? Math.round((total / audits.reduce((sum, audit) => sum + (audit.checklist?.length || 0), 0)) * 100)
              : 0;

            return (
              <div key={status} className="progress-row">
                <div className="progress-labels">
                  <span>{status}</span>
                  <strong>{total}</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${percentage}%` }} className="progress-bar progress-bar--status" />
                </div>
              </div>
            );
          })}
        </SectionCard>
      </div>

      <div className="quick-actions">
        <SectionCard title="Actions rapides" className="panel-surface">
          <div className="quick-action-grid">
            <button className="button button-primary" onClick={() => window.location.assign('/audits/new')}>Nouveau projet</button>
            <button className="button button-secondary" onClick={() => window.location.assign('/audits')}>Ouvrir un audit</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
