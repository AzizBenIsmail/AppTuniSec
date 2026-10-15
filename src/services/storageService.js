export const STORAGE_KEY = 'tunisec-app-state-v1';

export function readStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Lecture du stockage local impossible :', error);
    return null;
  }
}

export function writeStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Écriture dans le stockage local impossible :', error);
    return false;
  }
}

export function exportJsonFile(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function validateImportedData(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'Le fichier importé est invalide.' };
  }

  if (!Array.isArray(payload.audits)) {
    return { valid: false, message: 'Le fichier ne contient pas une liste d’audits valide.' };
  }

  return { valid: true };
}
