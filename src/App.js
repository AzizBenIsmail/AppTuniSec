import React, { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom';
import './App.css';
import { AuditProvider, useAudit } from './context/AuditContext';
import { defaultChecklist } from './data/demoData';
import {
  calculateAuditProgress,
  calculateComplianceStats,
  generateReportSummary
} from './services/auditService';
import { exportJsonFile, validateImportedData } from './services/storageService';

const statusOptions = ['Conforme', 'Partiellement conforme', 'Non conforme', 'Non applicable', 'À vérifier'];
const riskOptions = ['Faible', 'Moyen', 'Élevé', 'Critique'];
const wizardSteps = ['Organisation', 'Périmètre', 'Traitements', 'Checklist', 'Validation'];

function App() {
  return (
    <AuditProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuditProvider>
  );
}

function AppRouter() {
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

function ProtectedLayout() {
  const { isAuthenticated, settings } = useAudit();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`app-shell app-shell--${settings?.theme || 'dark'}`}>
      <Sidebar />
      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}

function Sidebar() {
  const navItems = [
    { label: 'Tableau de bord', path: '/dashboard' },
    { label: 'Audits', path: '/audits' },
    { label: 'Paramètres', path: '/settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">T</div>
        <div>
          <div className="brand-name">TuniSec</div>
          <small>Audit conformité</small>
        </div>
      </div>

      <nav className="nav-stack">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <span className="eyebrow">Demo</span>
        <p>Cette application simule un accès de démonstration, sans authentification réelle.</p>
      </div>
    </aside>
  );
}

function LoginPage() {
  const { loginDemo } = useAudit();
  const navigate = useNavigate();

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-badge">Plateforme de démonstration</div>
        <h1>TuniSec</h1>
        <p className="login-subtitle">
          Plateforme d’audit de conformité pour la protection des données personnelles en Tunisie.
        </p>
        <p>
          TuniSec aide les auditeurs, consultants et responsables conformité à piloter un audit basé sur
          la loi n° 2004-63, sans mettre en œuvre de backend ni d’authentification réelle.
        </p>
        <ul className="feature-list">
          <li>Cartographie des traitements</li>
          <li>Checklist juridique structurée</li>
          <li>Constatations, risques et actions correctives</li>
          <li>Rapport d’audit printable</li>
        </ul>
        <button className="button button-primary" onClick={handleDemoAccess}>
          Entrer dans la démo
        </button>
        <p className="muted-text">
          Attention : cette application ne garantit ni sécurité serveur ni confidentialité. N’utilisez pas de données personnelles réelles.
        </p>
      </div>
    </div>
  );
}

function DashboardPage() {
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
          {["Conforme", "Partiellement conforme", "Non conforme", "À vérifier", "Non applicable"].map((status) => {
            const total = audits.reduce((sum, audit) => sum + (calculateComplianceStats(audit)[status] || 0), 0);
            const percentage = audits.length && total ? Math.round((total / audits.reduce((sum, audit) => sum + (audit.checklist?.length || 0), 0)) * 100) : 0;

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

function AuditsPage() {
  const { audits, deleteAudit } = useAudit();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Tous');
  const [sortBy, setSortBy] = useState('startDate');

  const displayedAudits = [...audits]
    .filter((audit) => {
      const matchesSearch = [audit.title, audit.organizationName, audit.sector].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      );
      const matchesStatus = status === 'Tous' || audit.status === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return new Date(b.startDate) - new Date(a.startDate);
    });

  const handleDelete = (auditId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet audit et ses données associées ?')) {
      deleteAudit(auditId);
    }
  };

  return (
    <div className="page-header">
      <div className="page-toolbar">
        <div>
          <span className="eyebrow">Gestion des projets</span>
          <h1>Audits</h1>
        </div>
        <button className="button button-primary" onClick={() => (window.location.href = '/audits/new')}>
          Ajouter un audit
        </button>
      </div>

      <div className="filter-panel panel-surface">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une organisation ou un audit"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="Tous">Tous</option>
          <option value="Planifié">Planifié</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="À revoir">À revoir</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="startDate">Date de début</option>
          <option value="title">Titre</option>
          <option value="status">Statut</option>
        </select>
      </div>

      <div className="audit-grid">
        {displayedAudits.map((audit) => {
          const progress = calculateAuditProgress(audit);
          return (
            <div key={audit.id} className="audit-card panel-surface">
              <div className="audit-card-header">
                <div>
                  <h3>{audit.title}</h3>
                  <small>{audit.organizationName}</small>
                </div>
                <StatusBadge status={audit.status} />
              </div>

              <div className="meta-grid">
                <span>{audit.sector}</span>
                <span>{audit.lead}</span>
                <span>{new Date(audit.startDate).toLocaleDateString('fr-FR')}</span>
              </div>

              <p>{audit.scope}</p>

              <div className="progress-row compact">
                <div className="progress-labels">
                  <span>Progression</span>
                  <strong>{progress.percent}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${progress.percent}%` }} className="progress-bar progress-bar--blue" />
                </div>
              </div>

              <div className="card-actions">
                <button className="button button-secondary" onClick={() => (window.location.href = `/audits/${audit.id}`)}>
                  Ouvrir
                </button>
                <button className="button button-secondary" onClick={() => (window.location.href = `/audits/new?edit=${audit.id}`)}>
                  Modifier
                </button>
                <button className="button button-danger" onClick={() => handleDelete(audit.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewAuditPage() {
  const navigate = useNavigate();
  const { createAudit } = useAudit();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({
    title: '',
    organizationName: '',
    sector: 'Finance',
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
        executiveSummary: 'Audit initial créé via le wizard. Les constatations seront complétées dans l’espace de travail.',
        methodology: 'Analyse documentaire, contrôle de la conformité et synthèse de risques.',
        limitations: 'Le présent rapport constitue une base de travail, sans équivaloir à une validation juridique formelle.',
        conclusion: 'Des mesures d’ajustement doivent être validées avant conclusions définitives.'
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
            <div className="form-grid">
              <Field label="Titre de l’audit" error={errors.title}>
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </Field>
              <Field label="Organisation" error={errors.organizationName}>
                <input value={form.organizationName} onChange={(event) => setForm({ ...form, organizationName: event.target.value })} />
              </Field>
              <Field label="Secteur">
                <select value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })}>
                  <option value="Finance">Finance</option>
                  <option value="Santé">Santé</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Public">Public</option>
                  <option value="Technologie">Technologie</option>
                  <option value="Autre">Autre</option>
                </select>
              </Field>
              <Field label="Responsable / lead" error={errors.lead}>
                <input value={form.lead} onChange={(event) => setForm({ ...form, lead: event.target.value })} />
              </Field>
            </div>
          )}

          {currentStep === 'Périmètre' && (
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
          )}

          {currentStep === 'Traitements' && (
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

function AuditWorkspacePage() {
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

function SettingsPage() {
  const { settings, setSettings, audits, resetData, importData } = useAudit();
  const [profile, setProfile] = useState(settings?.profile || { name: '', role: '', organization: '' });
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    setProfile(settings?.profile || { name: '', role: '', organization: '' });
  }, [settings]);

  const handleExport = () => {
    exportJsonFile('tunisec-export.json', { settings, audits });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateImportedData(parsed);
      if (!validation.valid) {
        setImportMessage(validation.message);
        return;
      }

      if (window.confirm('Remplacer les données existantes par le fichier importé ?')) {
        importData(parsed);
        setImportMessage('Import réussi. Les données ont été mises à jour.');
      }
    } catch (error) {
      setImportMessage('Le fichier importé n’est pas un JSON valide.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser les données de démonstration ?')) {
      resetData();
    }
  };

  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">Paramètres</span>
        <h1>Configuration</h1>
      </div>

      <div className="two-column-layout">
        <SectionCard title="Profil de démonstration" className="panel-surface">
          <div className="form-grid">
            <Field label="Nom"><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></Field>
            <Field label="Rôle"><input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} /></Field>
            <Field label="Organisation"><input value={profile.organization} onChange={(event) => setProfile({ ...profile, organization: event.target.value })} /></Field>
            <Field label="Thème">
              <select value={settings?.theme || 'dark'} onChange={(event) => setSettings({ ...settings, theme: event.target.value })}>
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </Field>
          </div>
          <button className="button button-primary" onClick={() => setSettings({ ...settings, profile })}>Enregistrer</button>
        </SectionCard>

        <SectionCard title="Données et sécurité" className="panel-surface">
          <div className="stacked-form">
            <button className="button button-secondary" onClick={handleExport}>Exporter les données</button>
            <label className="button button-secondary upload-button">
              Importer JSON
              <input type="file" accept=".json" onChange={handleImport} />
            </label>
            <button className="button button-danger" onClick={handleReset}>Réinitialiser la démo</button>
            <p className="muted-text">
              Les données locales sont stockées dans le navigateur. Elles ne constituent pas une sauvegarde sécurisée ni un stockage centralisé.
            </p>
            {importMessage && <p className="status-note">{importMessage}</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>Page introuvable</h1>
      <p>La ressource demandée n’existe pas dans l’application TuniSec.</p>
      <button className="button button-primary" onClick={() => (window.location.href = '/dashboard')}>Retour au tableau de bord</button>
    </div>
  );
}

function SectionCard({ title, children, className }) {
  return (
    <section className={`section-card ${className || ''}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

function StatCard({ label, value, accent, compact = false }) {
  return (
    <div className={`stat-card stat-card--${accent} ${compact ? 'compact' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status || 'Planifié';
  return <span className={`status-badge status-${normalized.toLowerCase().replace(/\s+/g, '-')}`}>{normalized}</span>;
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

export default App;
