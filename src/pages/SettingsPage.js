import React, { useEffect, useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { exportJsonFile, validateImportedData } from '../services/storageService';
import { Field, SectionCard } from '../components/shared/ui';
import { translate as t } from '../i18n';

export function SettingsPage() {
  const { settings, setSettings, audits, resetData, importData, startOnboarding } = useAudit();
  const language = settings?.language || 'fr';
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

      if (window.confirm(t('Remplacer les données existantes par le fichier importé ?', language))) {
        importData(parsed);
        setImportMessage(t('Import réussi. Les données ont été mises à jour.', language));
      }
    } catch (error) {
      setImportMessage(t('Le fichier importé n’est pas un JSON valide.', language));
    }
  };

  const handleReset = () => {
    if (window.confirm(t('Réinitialiser les données de démonstration ?', language))) {
      resetData();
    }
  };

  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{t('Paramètres', language)}</span>
        <h1>{t('Configuration', language)}</h1>
      </div>

      <div className="two-column-layout">
        <SectionCard title={t('Profil de démonstration', language)} className="panel-surface">
          <div className="form-grid">
            <Field label={t('Nom', language)}><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></Field>
            <Field label={t('Rôle', language)}><input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} /></Field>
            <Field label={t('Organisation', language)}><input value={profile.organization} onChange={(event) => setProfile({ ...profile, organization: event.target.value })} /></Field>
            <Field label={t('Thème', language)}>
              <select value={settings?.theme || 'dark'} onChange={(event) => setSettings({ ...settings, theme: event.target.value })}>
                <option value="dark">{t('Sombre', language)}</option>
                <option value="light">{t('Clair', language)}</option>
              </select>
            </Field>
            <Field label={t('Langue', language)}>
              <select value={language} onChange={(event) => setSettings({ ...settings, language: event.target.value })}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </Field>
          </div>
          <button className="button button-primary" onClick={() => setSettings({ ...settings, profile })}>{t('Enregistrer', language)}</button>
          <button className="button button-secondary" onClick={startOnboarding}>{t('Relancer le guide', language)}</button>
        </SectionCard>

        <SectionCard title={t('Données et sécurité', language)} className="panel-surface">
          <div className="stacked-form">
            <button className="button button-secondary" onClick={handleExport}>{t('Exporter les données', language)}</button>
            <label className="button button-secondary upload-button">
              {t('Importer JSON', language)}
              <input type="file" accept=".json" onChange={handleImport} />
            </label>
            <button className="button button-danger" onClick={handleReset}>{t('Réinitialiser la démo', language)}</button>
            <p className="muted-text">
              {t('Les données locales sont stockées dans le navigateur. Elles ne constituent pas une sauvegarde sécurisée ni un stockage centralisé.', language)}
            </p>
            {importMessage && <p className="status-note">{importMessage}</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
