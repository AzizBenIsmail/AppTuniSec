import React, { useEffect, useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { exportJsonFile, validateImportedData } from '../services/storageService';
import { Field, SectionCard } from './shared/ui';

export function SettingsPage() {
  const { settings, setSettings, audits, resetData, importData } = useAudit();
  const [profile, setProfile] = useState(settings?.profile || { name: '', role: '', organization: '' });
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    setProfile(settings?.profile || { name: '', role: '', organization: '' });
  }, [settings]);

  const handleExport = () => {
    exportJsonFile('tunisec-export.json', { settings, audits });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateImportedData(parsed);
      if (!validation.valid) {
        setImportMessage(validation.message);
        return;
      }

      if (window.confirm('Remplacer les données existantes par le fichier importé ?')) {
        importData(parsed);
        setImportMessage('Import réussi. Les données ont été mises à jour.');
      }
    } catch (error) {
      setImportMessage('Le fichier importé n’est pas un JSON valide.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser les données de démonstration ?')) {
      resetData();
    }
  };

  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">Paramètres</span>
        <h1>Configuration</h1>
      </div>

      <div className="two-column-layout">
        <SectionCard title="Profil de démonstration" className="panel-surface">
          <div className="form-grid">
            <Field label="Nom"><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></Field>
            <Field label="Rôle"><input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} /></Field>
            <Field label="Organisation"><input value={profile.organization} onChange={(event) => setProfile({ ...profile, organization: event.target.value })} /></Field>
            <Field label="Thème">
              <select value={settings?.theme || 'dark'} onChange={(event) => setSettings({ ...settings, theme: event.target.value })}>
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </Field>
          </div>
          <button className="button button-primary" onClick={() => setSettings({ ...settings, profile })}>Enregistrer</button>
        </SectionCard>

        <SectionCard title="Données et sécurité" className="panel-surface">
          <div className="stacked-form">
            <button className="button button-secondary" onClick={handleExport}>Exporter les données</button>
            <label className="button button-secondary upload-button">
              Importer JSON
              <input type="file" accept=".json" onChange={handleImport} />
            </label>
            <button className="button button-danger" onClick={handleReset}>Réinitialiser la démo</button>
            <p className="muted-text">
              Les données locales sont stockées dans le navigateur. Elles ne constituent pas une sauvegarde sécurisée ni un stockage centralisé.
            </p>
            {importMessage && <p className="status-note">{importMessage}</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
