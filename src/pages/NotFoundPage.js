import React from 'react';

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1>Page introuvable</h1>
      <p>La ressource demandée n’existe pas dans l’application TuniSec.</p>
      <button className="button button-primary" onClick={() => (window.location.href = '/dashboard')}>Retour au tableau de bord</button>
    </div>
  );
}
