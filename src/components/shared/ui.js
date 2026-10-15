import React from 'react';

export function SectionCard({ title, children, className }) {
  return (
    <section className={`section-card ${className || ''}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

export function StatCard({ label, value, accent, compact = false }) {
  return (
    <div className={`stat-card stat-card--${accent} ${compact ? 'compact' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function StatusBadge({ status }) {
  const normalized = status || 'Planifié';
  return <span className={`status-badge status-${normalized.toLowerCase().replace(/\s+/g, '-')}`}>{normalized}</span>;
}

export function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
