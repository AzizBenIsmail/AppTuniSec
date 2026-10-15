import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { calculateAuditProgress } from '../services/auditService';
import { StatusBadge } from '../components/shared/ui';
import { getDateLocale, translate as t } from '../i18n';

export function AuditsPage() {
  const { audits, deleteAudit, settings } = useAudit();
  const language = settings?.language || 'fr';
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
    if (window.confirm(t('Voulez-vous vraiment supprimer cet audit et ses données associées ?', language))) {
      deleteAudit(auditId);
    }
  };

  return (
    <div className="page-header">
      <div className="page-toolbar">
        <div>
          <span className="eyebrow">{t('Gestion des projets', language)}</span>
          <h1>{t('Audits', language)}</h1>
        </div>
        <button className="button button-primary" onClick={() => (window.location.href = '/audits/new')}>
          {t('Ajouter un audit', language)}
        </button>
      </div>

      <div className="filter-panel panel-surface">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('Rechercher une organisation ou un audit', language)}
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {['Tous', 'Planifié', 'En cours', 'Terminé', 'À revoir'].map((value) => (
            <option key={value} value={value}>{t(value, language)}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="startDate">{t('Date de début', language)}</option>
          <option value="title">{t('Titre', language)}</option>
          <option value="status">{t('Statut', language)}</option>
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
                <span>{new Date(audit.startDate).toLocaleDateString(getDateLocale(language))}</span>
              </div>

              <p>{audit.scope}</p>

              <div className="progress-row compact">
                <div className="progress-labels">
                  <span>{t('Progression', language)}</span>
                  <strong>{progress.percent}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${progress.percent}%` }} className="progress-bar progress-bar--blue" />
                </div>
              </div>

              <div className="card-actions">
                <button className="button button-secondary" onClick={() => (window.location.href = `/audits/${audit.id}`)}>
                  {t('Ouvrir', language)}
                </button>
                <button className="button button-secondary" onClick={() => (window.location.href = `/audits/new?edit=${audit.id}`)}>
                  {t('Modifier', language)}
                </button>
                <button className="button button-danger" onClick={() => handleDelete(audit.id)}>
                  {t('Supprimer', language)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
