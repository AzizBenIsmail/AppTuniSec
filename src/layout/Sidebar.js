import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';
import { translate as t } from '../i18n';

export function Sidebar() {
  const { settings, setSettings, startOnboarding } = useAudit();
  const theme = settings?.theme || 'dark';
  const language = settings?.language || 'fr';
  const navItems = [
    { label: t('Tableau de bord', language), path: '/dashboard' },
    { label: t('Audits', language), path: '/audits' },
    { label: t('Paramètres', language), path: '/settings' }
  ];

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setSettings({ ...settings, theme: nextTheme });
  };

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">T</div>
        <div>
          <div className="brand-name">TuniSec</div>
          <small>{t('Audit conformité', language)}</small>
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

      <div className="sidebar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={t(theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre', language)}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {t(theme === 'dark' ? 'Mode clair' : 'Mode sombre', language)}
        </button>

        <label className="language-picker">
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

        <button type="button" className="theme-toggle help-toggle" onClick={startOnboarding}>
          <span aria-hidden="true">?</span>
          {t('Aide', language)}
        </button>
      </div>

      <div className="sidebar-card">
        <span className="eyebrow">{t('Demo', language)}</span>
        <p>{t('Cette application simule un accès de démonstration, sans authentification réelle.', language)}</p>
      </div>
    </aside>
  );
}
