import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { translate as t } from '../i18n';

export function LoginPage() {
  const { loginDemo, settings, setSettings } = useAudit();
  const navigate = useNavigate();
  const language = settings?.language || 'fr';

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <label className="language-picker login-language-picker">
        <span>{t('Langue', language)}</span>
        <select
          aria-label={t('Langue', language)}
          value={language}
          onChange={(event) => setSettings({ ...settings, language: event.target.value })}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </label>
      <div className="login-shell">
        <div className="login-hero">
          <div className="login-hero-panel">
            <div className="login-brand">
              <div className="brand-mark">T</div>
              <div>
                <div className="brand-name">TuniSec</div>
                <small>{t('Audit de conformité', language)}</small>
              </div>
            </div>

            <span className="login-badge">{t('Pour les PME tunisiennes', language)}</span>

            <h1>TuniSec</h1>
            <p className="login-subtitle">
              {t('Simplifiez votre audit de conformité à la protection des données personnelles avec un parcours guidé, pensé pour les entreprises sans équipe juridique dédiée.', language)}
            </p>

            <div className="login-metrics">
              <div>
                <strong>12+</strong>
                <span>{t('Contrôles', language)}</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Modules</span>
              </div>
              <div>
                <strong>1</strong>
                <span>{t('Démo', language)}</span>
              </div>
            </div>

            <ul className="feature-list">
              <li>{t('Cartographie des traitements', language)}</li>
              <li>{t('Checklist juridique structurée', language)}</li>
              <li>{t('Constatations, risques et actions correctives', language)}</li>
              <li>{t('Rapport d’audit printable', language)}</li>
            </ul>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <span className="eyebrow">{t('Accès', language)}</span>
            <h2>{t('Bienvenue', language)}</h2>
          </div>

          <p>
            {t('TuniSec aide les PME tunisiennes à structurer leur analyse de conformité, à prioriser leurs actions et à préparer un audit simple, exploitable et compréhensible par l’ensemble de l’entreprise. Ce démonstrateur ne remplace ni un avis juridique ni une conformité réglementaire formelle.', language)}
          </p>

          <div className="login-note">
            <strong>{t('Mode démonstration', language)}</strong>
            <span>{t('Un parcours guidé pour tester les étapes clés sans utiliser de données réelles.', language)}</span>
          </div>

          <button className="button button-primary login-button" onClick={handleDemoAccess}>
            {t('Entrer dans la démo', language)}
          </button>

          <p className="muted-text">
            {t('Attention : cette application ne garantit ni sécurité serveur ni confidentialité. N’utilisez pas de données personnelles réelles.', language)}
          </p>
        </div>
      </div>
    </div>
  );
}
