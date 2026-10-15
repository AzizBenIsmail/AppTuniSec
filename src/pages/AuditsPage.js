import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { calculateAuditProgress } from '../services/auditService';
import { StatusBadge } from '../components/shared/ui';

export function AuditsPage() {
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
