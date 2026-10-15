import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

export function Sidebar() {
  const { settings, setSettings } = useAudit();
  const theme = settings?.theme || 'dark';
  const navItems = [
    { label: 'Tableau de bord', path: '/dashboard' },
    { label: 'Audits', path: '/audits' },
    { label: 'Paramètres', path: '/settings' }
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

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      </button>

      <div className="sidebar-card">
        <span className="eyebrow">Demo</span>
        <p>Cette application simule un accès de démonstration, sans authentification réelle.</p>
      </div>
    </aside>
  );
}
