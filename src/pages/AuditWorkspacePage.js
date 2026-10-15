import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { calculateAuditProgress, calculateComplianceStats, generateReportSummary } from '../services/auditService';
import { Field, SectionCard, StatusBadge, StatCard } from '../components/shared/ui';
import { NotFoundPage } from './NotFoundPage';

const statusOptions = ['Conforme', 'Partiellement conforme', 'Non conforme', 'Non applicable', 'À vérifier'];
const riskOptions = ['Faible', 'Moyen', 'Élevé', 'Critique'];

export function AuditWorkspacePage() {
  const { auditId } = useParams();
  const { audits, updateChecklistItem, updateAudit, addEvidence, addFinding, addAction } = useAudit();
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
          <span className="eyebrow">Espace d’audit</span>
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
            {tab === 'overview' && 'Vue d’ensemble'}
            {tab === 'checklist' && 'Checklist'}
            {tab === 'evidence' && 'Preuves'}
            {tab === 'findings' && 'Constatations'}
            {tab === 'risk' && 'Risques'}
            {tab === 'actions' && 'Actions'}
            {tab === 'report' && 'Rapport'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="two-column-layout">
          <SectionCard title="Vue d’ensemble" className="panel-surface">
            <div className="detail-grid">
              <dl>
                <dt>Organisation</dt>
                <dd>{audit.organizationName}</dd>
                <dt>Secteur</dt>
                <dd>{audit.sector}</dd>
                <dt>Lead</dt>
                <dd>{audit.lead}</dd>
                <dt>Échéance</dt>
                <dd>{new Date(audit.targetDate).toLocaleDateString('fr-FR')}</dd>
              </dl>
            </div>
            <p>{audit.notes}</p>
          </SectionCard>

          <SectionCard title="Progression" className="panel-surface">
            <div className="progress-row">
              <div className="progress-labels">
                <span>État du contrôle</span>
                <strong>{progress.percent}%</strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress.percent}%` }} className="progress-bar progress-bar--blue" />
              </div>
            </div>
            <div className="mini-stat-grid">
              <StatCard label="Contrôles" value={progress.total} accent="blue" compact />
              <StatCard label="Conformes" value={complianceStats['Conforme']} accent="green" compact />
              <StatCard label="À vérifier" value={complianceStats['À vérifier']} accent="yellow" compact />
              <StatCard label="Non conformes" value={complianceStats['Non conforme']} accent="red" compact />
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'checklist' && (
        <SectionCard title="Checklist de conformité" className="panel-surface">
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
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="checklist-comments"><strong>Commentaire :</strong> {item.comments || '—'}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'evidence' && (
        <div className="two-column-layout">
          <SectionCard title="Ajouter une preuve" className="panel-surface">
            <form className="stacked-form" onSubmit={handleEvidenceSubmit}>
              <Field label="Titre"><input value={evidenceForm.title} onChange={(event) => setEvidenceForm({ ...evidenceForm, title: event.target.value })} /></Field>
              <Field label="Description"><textarea value={evidenceForm.description} onChange={(event) => setEvidenceForm({ ...evidenceForm, description: event.target.value })} rows={3} /></Field>
              <Field label="Catégorie">
                <select value={evidenceForm.category} onChange={(event) => setEvidenceForm({ ...evidenceForm, category: event.target.value })}>
                  <option value="Documentation">Documentation</option>
                  <option value="Droits des personnes">Droits des personnes</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Contrat">Contrat</option>
                </select>
              </Field>
              <Field label="Date"><input type="date" value={evidenceForm.date} onChange={(event) => setEvidenceForm({ ...evidenceForm, date: event.target.value })} /></Field>
              <Field label="Référence de document"><input value={evidenceForm.documentRef} onChange={(event) => setEvidenceForm({ ...evidenceForm, documentRef: event.target.value })} /></Field>
              <Field label="Notes"><textarea value={evidenceForm.notes} onChange={(event) => setEvidenceForm({ ...evidenceForm, notes: event.target.value })} rows={3} /></Field>
              <button className="button button-primary" type="submit">Enregistrer la preuve</button>
            </form>
          </SectionCard>

          <SectionCard title="Preuves documentées" className="panel-surface">
            {audit.evidence?.length ? (
              <ul className="list-items">
                {audit.evidence.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                    <small>{item.documentRef || 'Sans référence'}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">Aucune preuve enregistrée pour le moment.</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="two-column-layout">
          <SectionCard title="Nouvelle constatation" className="panel-surface">
            <form className="stacked-form" onSubmit={handleFindingSubmit}>
              <Field label="Titre"><input value={findingForm.title} onChange={(event) => setFindingForm({ ...findingForm, title: event.target.value })} /></Field>
              <Field label="Description"><textarea value={findingForm.description} onChange={(event) => setFindingForm({ ...findingForm, description: event.target.value })} rows={3} /></Field>
              <Field label="Référence légale"><input value={findingForm.legalReference} onChange={(event) => setFindingForm({ ...findingForm, legalReference: event.target.value })} /></Field>
              <Field label="Niveau de risque">
                <select value={findingForm.riskLevel} onChange={(event) => setFindingForm({ ...findingForm, riskLevel: event.target.value })}>
                  {riskOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Responsable"><input value={findingForm.responsible} onChange={(event) => setFindingForm({ ...findingForm, responsible: event.target.value })} /></Field>
              <Field label="Date cible"><input type="date" value={findingForm.targetDate} onChange={(event) => setFindingForm({ ...findingForm, targetDate: event.target.value })} /></Field>
              <button className="button button-primary" type="submit">Créer le constat</button>
            </form>
          </SectionCard>

          <SectionCard title="Constatations" className="panel-surface">
            {audit.findings?.length ? (
              <ul className="list-items">
                {audit.findings.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{item.riskLevel}</span>
                    <small>{item.responsible}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">Aucune constatation enregistrée.</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="two-column-layout">
          <SectionCard title="Évaluation des risques" className="panel-surface">
            <form className="stacked-form" onSubmit={handleRiskSubmit}>
              <Field label="Catégorie"><input value={riskForm.category} onChange={(event) => setRiskForm({ ...riskForm, category: event.target.value })} /></Field>
              <Field label="Probabilité"><input type="number" min="1" max="5" value={riskForm.likelihood} onChange={(event) => setRiskForm({ ...riskForm, likelihood: Number(event.target.value) })} /></Field>
              <Field label="Impact"><input type="number" min="1" max="5" value={riskForm.impact} onChange={(event) => setRiskForm({ ...riskForm, impact: Number(event.target.value) })} /></Field>
              <button className="button button-primary" type="submit">Calculer le risque</button>
            </form>
          </SectionCard>

          <SectionCard title="Historique des évaluations" className="panel-surface">
            {audit.risks?.length ? (
              <ul className="list-items">
                {audit.risks.map((risk) => (
                  <li key={risk.id} className="list-item">
                    <strong>{risk.category}</strong>
                    <span>Score {risk.score}</span>
                    <small>{risk.level}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">Aucune évaluation de risque enregistrée.</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="two-column-layout">
          <SectionCard title="Nouvelle action corrective" className="panel-surface">
            <form className="stacked-form" onSubmit={handleActionSubmit}>
              <Field label="Action"><input value={actionForm.title} onChange={(event) => setActionForm({ ...actionForm, title: event.target.value })} /></Field>
              <Field label="Description"><textarea value={actionForm.description} onChange={(event) => setActionForm({ ...actionForm, description: event.target.value })} rows={3} /></Field>
              <Field label="Constat associé"><input value={actionForm.linkedFinding} onChange={(event) => setActionForm({ ...actionForm, linkedFinding: event.target.value })} /></Field>
              <Field label="Responsable"><input value={actionForm.responsible} onChange={(event) => setActionForm({ ...actionForm, responsible: event.target.value })} /></Field>
              <Field label="Priorité"><select value={actionForm.priority} onChange={(event) => setActionForm({ ...actionForm, priority: event.target.value })}><option>Élevée</option><option>Moyenne</option><option>Faible</option></select></Field>
              <Field label="Date butoire"><input type="date" value={actionForm.deadline} onChange={(event) => setActionForm({ ...actionForm, deadline: event.target.value })} /></Field>
              <Field label="Progression (%)"><input type="number" min="0" max="100" value={actionForm.progress} onChange={(event) => setActionForm({ ...actionForm, progress: Number(event.target.value) })} /></Field>
              <button className="button button-primary" type="submit">Ajouter l’action</button>
            </form>
          </SectionCard>

          <SectionCard title="Plan d’actions" className="panel-surface">
            {audit.actions?.length ? (
              <ul className="list-items">
                {audit.actions.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.title}</strong>
                    <span>{item.status}</span>
                    <small>{item.responsible}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">Aucune action corrective enregistrée.</p>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'report' && (
        <SectionCard title="Aperçu du rapport" className="panel-surface report-preview">
          <div className="report-header">
            <div>
              <span className="eyebrow">Rapport d’audit</span>
              <h2>{audit.organizationName}</h2>
            </div>
            <button className="button button-secondary" onClick={() => window.print()}>
              Imprimer / PDF
            </button>
          </div>

          <p><strong>Résumé exécutif :</strong> {audit.report?.executiveSummary}</p>
          <p><strong>Méthodologie :</strong> {audit.report?.methodology}</p>
          <p><strong>Limites :</strong> {audit.report?.limitations}</p>
          <p><strong>Conclusion :</strong> {audit.report?.conclusion}</p>
          <div className="report-summary-box">
            <strong>Résumé généré :</strong>
            <span>{reportSummary}</span>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
