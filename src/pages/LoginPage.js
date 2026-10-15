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

            <span className="login-badge">Pour les PME tunisiennes</span>

            <h1>TuniSec</h1>
            <p className="login-subtitle">
              Simplifiez votre audit de conformité à la protection des données personnelles avec un parcours
              guidé, pensé pour les entreprises sans équipe juridique dédiée.
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
            TuniSec aide les PME tunisiennes à structurer leur analyse de conformité, à prioriser leurs
            actions et à préparer un audit simple, exploitable et compréhensible par l’ensemble de
            l’entreprise. Ce démonstrateur ne remplace ni un avis juridique ni une conformité réglementaire
            formelle.
          </p>

          <div className="login-note">
            <strong>Mode démonstration</strong>
            <span>Un parcours guidé pour tester les étapes clés sans utiliser de données réelles.</span>
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
