import React from 'react';
import { useAudit } from '../context/AuditContext';
import { translate as t } from '../i18n';

export function NotFoundPage() {
  const { settings } = useAudit();
  const language = settings?.language || 'fr';

  return (
    <div className="empty-state">
      <h1>{t('Page introuvable', language)}</h1>
      <p>{t('La ressource demandée n’existe pas dans l’application TuniSec.', language)}</p>
      <button className="button button-primary" onClick={() => (window.location.href = '/dashboard')}>{t('Retour au tableau de bord', language)}</button>
    </div>
  );
}
