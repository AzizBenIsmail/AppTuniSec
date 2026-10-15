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
      <div className="login-shell">
        <div className="login-hero">
          <div className="login-hero-panel">
            <div className="login-brand">
              <div className="brand-mark">T</div>
              <div>
                <div className="brand-name">TuniSec</div>
                <small>Audit de conformité</small>
              </div>
            </div>

            <span className="login-badge">Plateforme de démonstration</span>

            <h1>TuniSec</h1>
            <p className="login-subtitle">
              Contrôlez la conformité des traitements de données en Tunisie avec un cadre de travail
              structuré, clair et prêt à démonstration.
            </p>

            <div className="login-metrics">
              <div>
                <strong>12+</strong>
                <span>Contrôles</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Modules</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Démo</span>
              </div>
            </div>

            <ul className="feature-list">
              <li>Cartographie des traitements</li>
              <li>Checklist juridique structurée</li>
              <li>Constatations, risques et actions correctives</li>
              <li>Rapport d’audit printable</li>
            </ul>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <span className="eyebrow">Accès</span>
            <h2>Bienvenue</h2>
          </div>

          <p>
            TuniSec aide les auditeurs, consultants et responsables conformité à piloter un audit basé sur
            la loi n° 2004-63, sans mettre en œuvre de backend ni d’authentification réelle.
          </p>

          <div className="login-note">
            <strong>Mode démonstration</strong>
            <span>Cette application simule un accès sans authentification réelle.</span>
          </div>

          <button className="button button-primary login-button" onClick={handleDemoAccess}>
            Entrer dans la démo
          </button>

          <p className="muted-text">
            Attention : cette application ne garantit ni sécurité serveur ni confidentialité. N’utilisez pas
            de données personnelles réelles.
          </p>
        </div>
      </div>
    </div>
  );
}
