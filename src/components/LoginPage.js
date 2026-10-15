import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

export function LoginPage() {
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
