export const statusOrder = {
  'Conforme': 5,
  'Partiellement conforme': 4,
  'Non conforme': 2,
  'Non applicable': 6,
  'À vérifier': 3
};

export function calculateAuditProgress(audit) {
  const list = audit?.checklist ?? [];
  const total = list.length;
  const answered = list.filter((item) => item.status && item.status !== 'À vérifier').length;
  const compliant = list.filter((item) => item.status === 'Conforme').length;
  const percent = total ? Math.round((answered / total) * 100) : 0;

  return {
    total,
    answered,
    compliant,
    percent
  };
}

export function calculateComplianceStats(audit) {
  const list = audit?.checklist ?? [];
  const groups = {
    'Conforme': 0,
    'Partiellement conforme': 0,
    'Non conforme': 0,
    'Non applicable': 0,
    'À vérifier': 0
  };

  list.forEach((item) => {
    const status = item.status ?? 'À vérifier';
    if (Object.prototype.hasOwnProperty.call(groups, status)) {
      groups[status] += 1;
    }
  });

  return groups;
}

export function calculateRiskScore(risk) {
  if (!risk || !Number.isFinite(risk.likelihood) || !Number.isFinite(risk.impact)) {
    return 0;
  }
  return Math.min(25, Math.round((risk.likelihood * risk.impact) / 0.8));
}

export function generateReportSummary(audit) {
  const stats = calculateComplianceStats(audit);
  const total = audit?.checklist?.length ?? 0;
  const compliant = stats['Conforme'] ?? 0;
  const nonConform = stats['Non conforme'] ?? 0;
  const pending = stats['À vérifier'] ?? 0;

  return `Audit ${audit?.title ?? 'sans titre'} : ${compliant}/${total} contrôles conformes, ${nonConform} non conformes et ${pending} éléments à vérifier.`;
}
