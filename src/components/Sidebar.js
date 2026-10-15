import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const navItems = [
    { label: 'Tableau de bord', path: '/dashboard' },
    { label: 'Audits', path: '/audits' },
    { label: 'Paramètres', path: '/settings' }
  ];

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

      <div className="sidebar-card">
        <span className="eyebrow">Demo</span>
        <p>Cette application simule un accès de démonstration, sans authentification réelle.</p>
      </div>
    </aside>
  );
}
