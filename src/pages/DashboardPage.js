import React, { useMemo } from 'react';
import { useAudit } from '../context/AuditContext';
import { calculateComplianceStats } from '../services/auditService';
import { SectionCard, StatCard, StatusBadge } from '../components/shared/ui';
import { translate as t } from '../i18n';

export function DashboardPage() {
  const { audits, settings } = useAudit();
  const language = settings?.language || 'fr';

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
        <span className="eyebrow">{t('Résumé exécutif', language)}</span>
        <h1>{t('Tableau de bord', language)}</h1>
      </div>
      <button className="button button-primary" onClick={() => window.location.assign('/audits/new')}>
        {t('Créer un audit', language)}
      </button>

      <SectionCard title={t('Parcours guidé pour une PME', language)} className="panel-surface info-panel">
        <div className="guide-grid">
          <div className="guide-step">
            <span className="step-number">1</span>
            <div>
              <strong>{t('Identifier', language)}</strong>
              <p>{t('Qui collecte des données clientes, fournisseurs, salariés ou fichiers internes ?', language)}</p>
            </div>
          </div>
          <div className="guide-step">
            <span className="step-number">2</span>
            <div>
              <strong>{t('Évaluer', language)}</strong>
              <p>{t('Quels risques existent pour la confidentialité, la sécurité et les droits des personnes ?', language)}</p>
            </div>
          </div>
          <div className="guide-step">
            <span className="step-number">3</span>
            <div>
              <strong>{t('Agir', language)}</strong>
              <p>{t('Fixez 3 actions prioritaires simples et mesurables pour améliorer votre posture.', language)}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="stats-grid">
        <StatCard label={t('Projets d’audit', language)} value={stats.totalProjects} accent="blue" />
        <StatCard label={t('Audits en cours', language)} value={stats.auditsInProgress} accent="teal" />
        <StatCard label={t('Audits terminés', language)} value={stats.completedAudits} accent="green" />
        <StatCard label={t('Conformité globale', language)} value={`${stats.averageCompliance}%`} accent="orange" />
        <StatCard label={t('Non-conformités', language)} value={stats.nonConformities} accent="red" />
        <StatCard label={t('Constats à risque', language)} value={stats.highRisk} accent="purple" />
        <StatCard label={t('Actions correctives', language)} value={stats.pendingActions} accent="yellow" />
      </div>

      <div className="two-column-layout">
        <SectionCard title={t('Activité récente', language)} className="panel-surface">
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

        <SectionCard title={t('Répartition du statut', language)} className="panel-surface">
          {['Conforme', 'Partiellement conforme', 'Non conforme', 'À vérifier', 'Non applicable'].map((status) => {
            const total = audits.reduce((sum, audit) => sum + (calculateComplianceStats(audit)[status] || 0), 0);
            const percentage = audits.length && total
              ? Math.round((total / audits.reduce((sum, audit) => sum + (audit.checklist?.length || 0), 0)) * 100)
              : 0;

            return (
              <div key={status} className="progress-row">
                <div className="progress-labels">
                  <span>{t(status, language)}</span>
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
        <SectionCard title={t('Actions rapides', language)} className="panel-surface">
          <div className="quick-action-grid">
            <button className="button button-primary" onClick={() => window.location.assign('/audits/new')}>{t('Nouveau projet', language)}</button>
            <button className="button button-secondary" onClick={() => window.location.assign('/audits')}>{t('Ouvrir un audit', language)}</button>
          </div>
        </SectionCard>
      </div>

      <div className="simple-tips">
        <SectionCard title={t('Priorités recommandées pour une PME', language)} className="panel-surface">
          <ul className="simple-list">
            <li>{t('Identifier les fichiers sensibles, les messageries et les outils de gestion utilisés par l’entreprise.', language)}</li>
            <li>{t('Limiter l’accès aux données et documenter qui peut les consulter ou les modifier.', language)}</li>
            <li>{t('Mettre en place un plan d’action simple, priorisé et suivi chaque trimestre.', language)}</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
