import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { defaultChecklist } from '../data/demoData';
import { Field } from '../components/shared/ui';

const wizardSteps = ['Organisation', 'Périmètre', 'Traitements', 'Checklist', 'Validation'];

export function NewAuditPage() {
  const navigate = useNavigate();
  const { createAudit } = useAudit();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({
    title: '',
    organizationName: '',
    sector: 'Commerce',
    scope: '',
    objectives: '',
    lead: '',
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
    status: 'Planifié',
    notes: '',
    processingActivities: '',
    checklistFocus: 'Données clients et dossiers internes'
  });
  const [errors, setErrors] = useState({});

  const nextStep = () => {
    const currentErrors = {};

    if (stepIndex === 0) {
      if (!form.organizationName.trim()) currentErrors.organizationName = 'Renseignez le nom de l’organisation.';
      if (!form.lead.trim()) currentErrors.lead = 'Indiquez le responsable de l’audit.';
    }

    if (stepIndex === 1) {
      if (!form.scope.trim()) currentErrors.scope = 'Le périmètre est requis.';
      if (!form.objectives.trim()) currentErrors.objectives = 'Les objectifs sont requis.';
    }

    if (stepIndex === 2 && !form.processingActivities.trim()) {
      currentErrors.processingActivities = 'Décrivez les traitements de données concernés.';
    }

    if (Object.keys(currentErrors).length) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    setStepIndex((previous) => Math.min(previous + 1, wizardSteps.length - 1));
  };

  const previousStep = () => setStepIndex((previous) => Math.max(previous - 1, 0));

  const handleSubmit = () => {
    const validation = {};

    if (!form.title.trim()) validation.title = 'Le titre est requis.';
    if (!form.organizationName.trim()) validation.organizationName = 'L’organisation est requise.';
    if (!form.scope.trim()) validation.scope = 'Le périmètre est requis.';
    if (!form.objectives.trim()) validation.objectives = 'Les objectifs sont requis.';

    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    const audit = {
      id: `audit-${Date.now()}`,
      title: form.title || `${form.organizationName} – Audit de conformité`,
      organizationName: form.organizationName,
      sector: form.sector,
      scope: form.scope,
      objectives: form.objectives,
      lead: form.lead,
      startDate: form.startDate,
      targetDate: form.targetDate,
      status: form.status,
      notes: form.notes,
      checklist: defaultChecklist.map((item) => ({
        ...item,
        status: 'À vérifier',
        comments: ''
      })),
      evidence: [],
      findings: [],
      risks: [],
      actions: [],
      report: {
        executiveSummary: 'Ce rapport donne une vue synthétique des points à surveiller pour une PME. Il aide à prioriser les actions sans remplacer un avis juridique spécialisé.',
        methodology: 'Analyse documentaire, évaluation pratique des traitements de données et priorisation des actions correctives.',
        limitations: 'Le présent rapport constitue une base de travail utile à la gestion et au pilotage interne. Il ne se substitue pas à un conseil juridique formel.',
        conclusion: 'Les priorités de correction doivent être validées par la direction et suivies dans le cadre d’un plan d’action concret.'
      }
    };

    createAudit(audit);
    navigate('/audits');
  };

  const currentStep = wizardSteps[stepIndex];

  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">Nouveau projet</span>
        <h1>Assistant de création</h1>
      </div>

      <div className="wizard panel-surface">
        <div className="wizard-steps">
          {wizardSteps.map((step, index) => (
            <div key={step} className={`wizard-step ${index === stepIndex ? 'active' : ''}`}>
              {index + 1}. {step}
            </div>
          ))}
        </div>

        <div className="wizard-body">
          {currentStep === 'Organisation' && (
            <>
              <div className="info-banner">
                Répondez simplement : quelle est votre activité, qui pilote la démarche et quel est le besoin principal ?
              </div>
              <div className="form-grid">
                <Field label="Titre de l’audit" error={errors.title}>
                  <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                </Field>
                <Field label="Organisation" error={errors.organizationName}>
                  <input value={form.organizationName} onChange={(event) => setForm({ ...form, organizationName: event.target.value })} />
                </Field>
                <Field label="Secteur">
                  <select value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })}>
                    <option value="Commerce">Commerce</option>
                    <option value="Services">Services</option>
                    <option value="Industrie">Industrie</option>
                    <option value="Tourisme">Tourisme</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Santé">Santé</option>
                    <option value="Finance">Finance</option>
                    <option value="Technologie">Technologie</option>
                    <option value="Autre">Autre</option>
                  </select>
                </Field>
                <Field label="Responsable / lead" error={errors.lead}>
                  <input value={form.lead} onChange={(event) => setForm({ ...form, lead: event.target.value })} />
                </Field>
              </div>
            </>
          )}

          {currentStep === 'Périmètre' && (
            <>
              <div className="info-banner">
                Exemple : clients, fournisseurs, salariés, cartes bancaires, historique de commandes, documents internes.
              </div>
              <div className="form-grid">
                <Field label="Périmètre d’audit" error={errors.scope}>
                  <textarea value={form.scope} onChange={(event) => setForm({ ...form, scope: event.target.value })} rows={5} />
                </Field>
                <Field label="Objectifs" error={errors.objectives}>
                  <textarea value={form.objectives} onChange={(event) => setForm({ ...form, objectives: event.target.value })} rows={5} />
                </Field>
                <Field label="Date de début">
                  <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
                </Field>
                <Field label="Date cible">
                  <input type="date" value={form.targetDate} onChange={(event) => setForm({ ...form, targetDate: event.target.value })} />
                </Field>
              </div>
            </>
          )}

          {currentStep === 'Traitements' && (
            <>
              <div className="info-banner">
                Décrivez simplement les traitements clés ; vous n’avez pas besoin d’un vocabulaire juridique pour commencer.
              </div>
              <div className="form-grid">
                <Field label="Activités de traitement" error={errors.processingActivities}>
                  <textarea value={form.processingActivities} onChange={(event) => setForm({ ...form, processingActivities: event.target.value })} rows={5} />
                </Field>
                <Field label="Focus checklist">
                  <input value={form.checklistFocus} onChange={(event) => setForm({ ...form, checklistFocus: event.target.value })} />
                </Field>
                <Field label="Statut initial">
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="À revoir">À revoir</option>
                  </select>
                </Field>
                <Field label="Notes">
                  <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={4} />
                </Field>
              </div>
            </>
          )}

          {currentStep === 'Checklist' && (
            <div className="checklist-preview">
              {defaultChecklist.slice(0, 6).map((item) => (
                <div key={item.id} className="checklist-item-preview">
                  <span className="item-id">{item.id}</span>
                  <div>
                    <strong>{item.category}</strong>
                    <p>{item.question}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'Validation' && (
            <div className="review-panel">
              <h3>Récapitulatif</h3>
              <ul>
                <li><strong>Organisation :</strong> {form.organizationName}</li>
                <li><strong>Lead :</strong> {form.lead}</li>
                <li><strong>Début :</strong> {form.startDate}</li>
                <li><strong>Objectifs :</strong> {form.objectives}</li>
                <li><strong>Traitements :</strong> {form.processingActivities}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="wizard-actions">
          <button className="button button-secondary" onClick={previousStep} disabled={stepIndex === 0}>
            Précédent
          </button>
          {stepIndex < wizardSteps.length - 1 ? (
            <button className="button button-primary" onClick={nextStep}>
              Suivant
            </button>
          ) : (
            <button className="button button-primary" onClick={handleSubmit}>
              Créer l’audit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
