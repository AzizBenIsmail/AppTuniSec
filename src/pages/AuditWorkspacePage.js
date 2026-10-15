import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { calculateAuditProgress, calculateComplianceStats, generateReportSummary } from '../services/auditService';
import { Field, SectionCard, StatusBadge, StatCard } from '../components/shared/ui';
import { NotFoundPage } from './NotFoundPage';
import { getDateLocale, translate as t } from '../i18n';

const statusOptions = ['Conforme', 'Partiellement conforme', 'Non conforme', 'Non applicable', 'À vérifier'];
const riskOptions = ['Faible', 'Moyen', 'Élevé', 'Critique'];

export function AuditWorkspacePage() {
  const { auditId } = useParams();
  const { audits, updateChecklistItem, updateAudit, addEvidence, addFinding, addAction, settings } = useAudit();
  const language = settings?.language || 'fr';
  const audit = audits.find((item) => item.id === auditId);
  const [activeTab, setActiveTab] = useState('overview');
  const [evidenceForm, setEvidenceForm] = useState({ title: '', description: '', category: 'Documentation', date: new Date().toISOString().slice(0, 10), itemId: 'A01', documentRef: '', notes: '' });
  const [findingForm, setFindingForm] = useState({ title: '', description: '', legalReference: 'A01', riskLevel: 'Moyen', status: 'Ouvert', responsible: '', targetDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10) });
  const [actionForm, setActionForm] = useState({ title: '', description: '', linkedFinding: '', responsible: '', priority: 'Moyenne', deadline: new Date(Date.now() + 86400000 * 20).toISOString().slice(0, 10), status: 'Planifiée', progress: 0 });
  const [riskForm, setRiskForm] = useState({ category: 'Sécurité', likelihood: 2, impact: 3 });

  if (!audit) {
    return <NotFoundPage />;
  }

  const handleEvidenceSubmit = (event) => {
    event.preventDefault();
    const evidence = {
      id: `ev-${Date.now()}`,
      ...evidenceForm
    };
    addEvidence(audit.id, evidence);
    setEvidenceForm({
      title: '',
      description: '',
      category: 'Documentation',
      date: new Date().toISOString().slice(0, 10),
      itemId: 'A01',
      documentRef: '',
      notes: ''
    });
  };

  const handleFindingSubmit = (event) => {
    event.preventDefault();
    const finding = {
      id: `f-${Date.now()}`,
      ...findingForm,
      evidence: 'Observation issue de l’audit',
      potentialImpact: 'À préciser lors de la validation',
      recommendedAction: 'Définir une action corrective avant clôture.'
    };
    addFinding(audit.id, finding);
    setFindingForm({
      title: '',
      description: '',
      legalReference: 'A01',
      riskLevel: 'Moyen',
      status: 'Ouvert',
      responsible: '',
      targetDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10)
    });
  };

  const handleActionSubmit = (event) => {
    event.preventDefault();
    const action = {
      id: `a-${Date.now()}`,
      ...actionForm,
      completionNotes: 'Action planifiée'
    };
    addAction(audit.id, action);
    setActionForm({
      title: '',
      description: '',
      linkedFinding: '',
      responsible: '',
      priority: 'Moyenne',
      deadline: new Date(Date.now() + 86400000 * 20).toISOString().slice(0, 10),
      status: 'Planifiée',
      progress: 0
    });
  };

  const handleRiskSubmit = (event) => {
    event.preventDefault();
    const score = riskForm.likelihood * riskForm.impact;
    const level = score >= 12 ? 'Élevé' : score >= 7 ? 'Moyen' : 'Faible';
    const risk = {
      id: `r-${Date.now()}`,
      ...riskForm,
      score,
      level,
      controls: 'Contrôles existants à préciser',
      mitigation: 'Mise en œuvre d’actions correctives.'
    };

    updateAudit(audit.id, (currentAudit) => ({
      ...currentAudit,
      risks: [risk, ...(currentAudit.risks || [])]
    }));
    setRiskForm({ category: 'Sécurité', likelihood: 2, impact: 3 });
  };

  const complianceStats = calculateComplianceStats(audit);
  const progress = calculateAuditProgress(audit);
  const reportSummary = generateReportSummary(audit);

  return (
    <div className="page-header">
      <div className="page-toolbar">
        <div>
          <span className="eyebrow">{t('Espace d’audit', language)}</span>
          <h1>{audit.title}</h1>
        </div>
        <StatusBadge status={audit.status} />
      </div>

      <div className="workspace-tabs">
        {['overview', 'checklist', 'evidence', 'findings', 'risk', 'actions', 'report'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && t('Vue d’ensemble', language)}
            {tab === 'checklist' && t('Checklist', language)}
            {tab === 'evidence' && t('Preuves', language)}
            {tab === 'findings' && t('Constatations', language)}
            {tab === 'risk' && t('Risques', language)}
            {tab === 'actions' && t('Actions', language)}
            {tab === 'report' && t('Rapport', language)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="two-column-layout">
          <SectionCard title={t('Vue d’ensemble', language)} className="panel-surface">
            <div className="detail-grid">
              <dl>
                <dt>{t('Organisation', language)}</dt>
                <dd>{audit.organizationName}</dd>
                <dt>{t('Secteur', language)}</dt>
                <dd>{audit.sector}</dd>
                <dt>Lead</dt>
                <dd>{audit.lead}</dd>
                <dt>{t('Échéance', language)}</dt>
                <dd>{new Date(audit.targetDate).toLocaleDateString(getDateLocale(language))}</dd>
              </dl>
            </div>
            <p>{audit.notes}</p>
          </SectionCard>

          <SectionCard title={t('Progression', language)} className="panel-surface">
            <div className="progress-row">
              <div className="progress-labels">
                <span>{t('État du contrôle', language)}</span>
                <strong>{progress.percent}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress.percent}%` }} className="progress-bar progress-bar--blue" />
              </div>
            </div>
            <div className="mini-stat-grid">
              <StatCard label={t('Contrôles', language)} value={progress.total} accent="blue" compact />
              <StatCard label={t('Conformes', language)} value={complianceStats['Conforme']} accent="green" compact />
              <StatCard label={t('À vérifier', language)} value={complianceStats['À vérifier']} accent="yellow" compact />
              <StatCard label={t('Non conformes', language)} value={complianceStats['Non conforme']} accent="red" compact />
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'checklist' && (
        <SectionCard title={t('Checklist de conformité', language)} className="panel-surface">
          <div className="checklist-list">
            {audit.checklist.map((item) => (
              <div key={item.id} className="checklist-line">
                <div className="checklist-header">
                  <span className="item-id">{item.id}</span>
                  <strong>{item.category}</strong>
                </div>
                <p>{item.question}</p>
                <div className="checklist-meta">
                  <small>{item.legalReference}</small>
                  <select
                    value={item.status}
                    onChange={(event) => updateChecklistItem(audit.id, item.id, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{t(status, language)}</option>
                    ))}
                  </select>
                </div>
                <div className="checklist-comments"><strong>{t('Commentaire :', language)}</strong> {item.comments || '—'}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'evidence' && (
        <div className="two-column-layout">
          <SectionCard title={t('Ajouter une preuve', language)} className="panel-surface">
            <form className="stacked-form" onSubmit={handleEvidenceSubmit}>
              <Field label={t('Titre', language)}><input value={evidenceForm.title} onChange={(event) => setEvidenceForm({ ...evidenceForm, title: event.target.value })} /></Field>
              <Field label={t('Description', language)}><textarea value={evidenceForm.description} onChange={(event) => setEvidenceForm({ ...evidenceForm, description: event.target.value })} rows={3} /></Field>
              <Field label={t('Catégorie', language)}>
                <select value={evidenceForm.category} onChange={(event) => setEvidenceForm({ ...evidenceForm, category: event.target.value })}>
                  <option value="Documentation">{t('Documentation', language)}</option>
                  <option value="Droits des personnes">{t('Droits des personnes', language)}</option>
                  <option value="Sécurité">{t('Sécurité', language)}</option>
                  <option value="Contrat">{t('Contrat', language)}</option>
                </select>
              </Field>
              <Field label={t('Date', language)}><input type="date" value={evidenceForm.date} onChange={(event) => setEvidenceForm({ ...evidenceForm, date: event.target.value })} /></Field>
              <Field label={t('Référence de document', language)}><input value={evidenceForm.documentRef} onChange={(event) => setEvidenceForm({ ...evidenceForm, documentRef: event.target.value })} /></Field>
              <Field label={t('Notes', language)}><textarea value={evidenceForm.notes} onChange={(event) => setEvidenceForm({ ...evidenceForm, notes: event.target.value })} rows={3} /></Field>
              <button className="button button-primary" type="submit">{t('Enregistrer la preuve', language)}</button>
            </form>
          </SectionCard>

          <SectionCard title={t('Preuves documentées', language)} className="panel-surface">
            {audit.evidence?.length ? (
              <ul className="list-items">
                {audit.evidence.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{t(item.category, language)}</span>
                    <small>{item.documentRef || t('Sans référence', language)}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">{t('Aucune preuve enregistrée pour le moment.', language)}</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="two-column-layout">
          <SectionCard title={t('Nouvelle constatation', language)} className="panel-surface">
            <form className="stacked-form" onSubmit={handleFindingSubmit}>
              <Field label={t('Titre', language)}><input value={findingForm.title} onChange={(event) => setFindingForm({ ...findingForm, title: event.target.value })} /></Field>
              <Field label={t('Description', language)}><textarea value={findingForm.description} onChange={(event) => setFindingForm({ ...findingForm, description: event.target.value })} rows={3} /></Field>
              <Field label={t('Référence légale', language)}><input value={findingForm.legalReference} onChange={(event) => setFindingForm({ ...findingForm, legalReference: event.target.value })} /></Field>
              <Field label={t('Niveau de risque', language)}>
                <select value={findingForm.riskLevel} onChange={(event) => setFindingForm({ ...findingForm, riskLevel: event.target.value })}>
                  {riskOptions.map((option) => (
                    <option key={option} value={option}>{t(option, language)}</option>
                  ))}
                </select>
              </Field>
              <Field label={t('Responsable', language)}><input value={findingForm.responsible} onChange={(event) => setFindingForm({ ...findingForm, responsible: event.target.value })} /></Field>
              <Field label={t('Date cible', language)}><input type="date" value={findingForm.targetDate} onChange={(event) => setFindingForm({ ...findingForm, targetDate: event.target.value })} /></Field>
              <button className="button button-primary" type="submit">{t('Créer le constat', language)}</button>
            </form>
          </SectionCard>

          <SectionCard title={t('Constatations', language)} className="panel-surface">
            {audit.findings?.length ? (
              <ul className="list-items">
                {audit.findings.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{t(item.riskLevel, language)}</span>
                    <small>{item.responsible}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">{t('Aucune constatation enregistrée.', language)}</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="two-column-layout">
          <SectionCard title={t('Évaluation des risques', language)} className="panel-surface">
            <form className="stacked-form" onSubmit={handleRiskSubmit}>
              <Field label={t('Catégorie', language)}><input value={riskForm.category} onChange={(event) => setRiskForm({ ...riskForm, category: event.target.value })} /></Field>
              <Field label={t('Probabilité', language)}><input type="number" min="1" max="5" value={riskForm.likelihood} onChange={(event) => setRiskForm({ ...riskForm, likelihood: Number(event.target.value) })} /></Field>
              <Field label={t('Impact', language)}><input type="number" min="1" max="5" value={riskForm.impact} onChange={(event) => setRiskForm({ ...riskForm, impact: Number(event.target.value) })} /></Field>
              <button className="button button-primary" type="submit">{t('Calculer le risque', language)}</button>
            </form>
          </SectionCard>

          <SectionCard title={t('Historique des évaluations', language)} className="panel-surface">
            {audit.risks?.length ? (
              <ul className="list-items">
                {audit.risks.map((risk) => (
                  <li key={risk.id} className="list-item">
                    <strong>{risk.category}</strong>
                    <span>{t('Score', language)} {risk.score}</span>
                    <small>{t(risk.level, language)}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">{t('Aucune évaluation de risque enregistrée.', language)}</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="two-column-layout">
          <SectionCard title={t('Nouvelle action corrective', language)} className="panel-surface">
            <form className="stacked-form" onSubmit={handleActionSubmit}>
              <Field label={t('Action', language)}><input value={actionForm.title} onChange={(event) => setActionForm({ ...actionForm, title: event.target.value })} /></Field>
              <Field label={t('Description', language)}><textarea value={actionForm.description} onChange={(event) => setActionForm({ ...actionForm, description: event.target.value })} rows={3} /></Field>
              <Field label={t('Constat associé', language)}><input value={actionForm.linkedFinding} onChange={(event) => setActionForm({ ...actionForm, linkedFinding: event.target.value })} /></Field>
              <Field label={t('Responsable', language)}><input value={actionForm.responsible} onChange={(event) => setActionForm({ ...actionForm, responsible: event.target.value })} /></Field>
              <Field label={t('Priorité', language)}><select value={actionForm.priority} onChange={(event) => setActionForm({ ...actionForm, priority: event.target.value })}><option value="Élevée">{t('Élevée', language)}</option><option value="Moyenne">{t('Moyenne', language)}</option><option value="Faible">{t('Faible', language)}</option></select></Field>
              <Field label={t('Date butoire', language)}><input type="date" value={actionForm.deadline} onChange={(event) => setActionForm({ ...actionForm, deadline: event.target.value })} /></Field>
              <Field label="Progression (%)"><input type="number" min="0" max="100" value={actionForm.progress} onChange={(event) => setActionForm({ ...actionForm, progress: Number(event.target.value) })} /></Field>
              <button className="button button-primary" type="submit">{t('Ajouter l’action', language)}</button>
            </form>
          </SectionCard>

          <SectionCard title={t('Plan d’actions', language)} className="panel-surface">
            {audit.actions?.length ? (
              <ul className="list-items">
                {audit.actions.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{t(item.status, language)}</span>
                    <small>{item.responsible}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">{t('Aucune action corrective enregistrée.', language)}</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'report' && (
        <SectionCard title={t('Aperçu du rapport', language)} className="panel-surface report-preview">
          <div className="report-header">
            <div>
              <span className="eyebrow">{t('Rapport d’audit', language)}</span>
              <h2>{audit.organizationName}</h2>
            </div>
            <button className="button button-secondary" onClick={() => window.print()}>
              {t('Imprimer / PDF', language)}
            </button>
          </div>

          <p><strong>{t('Résumé exécutif :', language)}</strong> {audit.report?.executiveSummary}</p>
          <p><strong>{t('Méthodologie :', language)}</strong> {audit.report?.methodology}</p>
          <p><strong>{t('Limites :', language)}</strong> {audit.report?.limitations}</p>
          <p><strong>{t('Conclusion :', language)}</strong> {audit.report?.conclusion}</p>
          <div className="report-summary-box">
            <strong>{t('Résumé généré :', language)}</strong>
            <span>{reportSummary}</span>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
