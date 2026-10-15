export const defaultChecklist = [
  {
    id: 'A01',
    category: 'Identification des traitements',
    question: 'L’organisation a-t-elle identifié et documenté ses traitements de données personnelles ?',
    legalReference: 'Loi n° 2004-63, articles 8 et 11',
    explanation: 'Le registre des traitements et la cartographie des activités de traitement doivent être connus et maintenus à jour.',
    evidence: 'Registre des traitements, procédures internes, inventaires des applications.',
    status: 'À vérifier',
    riskLevel: 'Moyen',
    comments: ''
  },
  {
    id: 'A02',
    category: 'Finalités et légitimité',
    question: 'Les finalités du traitement sont-elles explicitement définies et légitimes ?',
    legalReference: 'Loi n° 2004-63, article 12',
    explanation: 'Les données ne doivent être collectées que pour des finalités déterminées, explicites et légitimes.',
    evidence: 'Mises à jour de la politique de confidentialité, formulaires, consentements.',
    status: 'Conforme',
    riskLevel: 'Faible',
    comments: 'Finalités clairement documentées pour les dossiers clients.'
  },
  {
    id: 'A03',
    category: 'Information des personnes',
    question: 'Les personnes concernées reçoivent-elles les informations requises avant la collecte ?',
    legalReference: 'Loi n° 2004-63, articles 13 et 14',
    explanation: 'L’information doit porter sur les finalités, les destinataires, les droits, la durée de conservation et l’identité du responsable.',
    evidence: 'Fiches d’information, notices d’usage, consentements électroniques.',
    status: 'Partiellement conforme',
    riskLevel: 'Moyen',
    comments: 'Le formulaire de collecte ne couvre pas encore tous les droits.'
  },
  {
    id: 'A04',
    category: 'Exactitude et pertinence',
    question: 'Les données sont-elles pertinentes, exactes et mises à jour ?',
    legalReference: 'Loi n° 2004-63, article 16',
    explanation: 'Il convient de vérifier la qualité des données collectées et les mécanismes de correction.',
    evidence: 'Procédures de mise à jour, demandes de rectification, contrôles de qualité.',
    status: 'Conforme',
    riskLevel: 'Faible',
    comments: 'Contrôles de cohérence mis en place sur les données clients.'
  },
  {
    id: 'A05',
    category: 'Conservation et suppression',
    question: 'Les durées de conservation sont-elles définies et respectées ?',
    legalReference: 'Loi n° 2004-63, article 17',
    explanation: 'Les données doivent être conservées uniquement pendant la durée strictement nécessaire aux finalités prévues.',
    evidence: 'Politique de conservation, échéanciers de suppression, listes de dossiers clôturés.',
    status: 'À vérifier',
    riskLevel: 'Élevé',
    comments: 'Des archives anciennes nécessitent une revue de conservation.'
  },
  {
    id: 'A06',
    category: 'Droits des personnes',
    question: 'Les droits d’accès, de rectification, d’opposition et d’effacement sont-ils exercés correctement ?',
    legalReference: 'Loi n° 2004-63, articles 19 à 22',
    explanation: 'Les personnes concernées doivent pouvoir exercer leurs droits dans des conditions connues et accessibles.',
    evidence: 'Procédure de gestion des demandes, formulaire de demande, logs d’intervention.',
    status: 'Partiellement conforme',
    riskLevel: 'Moyen',
    comments: 'Le traitement des demandes est bien documenté, mais le délai de réponse n’est pas toujours traçable.'
  },
  {
    id: 'A07',
    category: 'Sécurité et confidentialité',
    question: 'Des mesures de sécurité appropriées protègent-elles les données personnelles ?',
    legalReference: 'Loi n° 2004-63, article 24',
    explanation: 'Les mesures techniques et organisationnelles doivent être proportionnées au risque et au type de données traitées.',
    evidence: 'Politique de sécurité, journal d’audit, contrôles MFA, chiffrement des supports.',
    status: 'Conforme',
    riskLevel: 'Faible',
    comments: 'MFA et journalisation activés sur les accès administratifs.'
  },
  {
    id: 'A08',
    category: 'Gestion des accès',
    question: 'Les accès aux données sont-ils limités selon les besoins, avec une revue régulière ?',
    legalReference: 'Loi n° 2004-63, article 24',
    explanation: 'Le principe du besoin d’accès et la revue des privilèges sont fondamentaux pour limiter l’exposition des données.',
    evidence: 'Liste des droits, revue des accès, procédure d’onboarding/offboarding.',
    status: 'Non conforme',
    riskLevel: 'Élevé',
    comments: 'Plusieurs comptes administrateurs ne sont pas révisés régulièrement.'
  },
  {
    id: 'A09',
    category: 'Transmission à des tiers',
    question: 'Les divulgations de données à des tiers sont-elles contrôlées et documentées ?',
    legalReference: 'Loi n° 2004-63, article 26',
    explanation: 'Les flux de transmission à des partenaires ou sous-traitants doivent être encadrés et justifiés.',
    evidence: 'Contrats, accords de confidentialité, liste des transferts.',
    status: 'À vérifier',
    riskLevel: 'Moyen',
    comments: 'À compléter pour les sous-traitants externes.'
  },
  {
    id: 'A10',
    category: 'Sous-traitants et fournisseurs',
    question: 'Les sous-traitants imposent-ils des garanties suffisantes en matière de protection des données ?',
    legalReference: 'Loi n° 2004-63, article 27',
    explanation: 'Des clauses contractuelles et des contrôles de sécurité doivent encadrer le recours à des prestataires.',
    evidence: 'Contrats, questionnaires de sécurité, procédures de supervision.',
    status: 'Conforme',
    riskLevel: 'Faible',
    comments: 'Les principaux fournisseurs sont soumis à des clauses de protection des données.'
  },
  {
    id: 'A11',
    category: 'Transferts internationaux',
    question: 'Les éventuels transferts hors du territoire national sont-ils validés et documentés ?',
    legalReference: 'Loi n° 2004-63, articles 28 et 29',
    explanation: 'Des règles spécifiques s’appliquent lorsqu’une donnée traverse des frontières avec des pays tiers ou des organisations internationales.',
    evidence: 'Matrice des transferts, évaluations de risques, accords de transfert.',
    status: 'Non applicable',
    riskLevel: 'Faible',
    comments: 'Aucun transfert international connu à ce stade.'
  },
  {
    id: 'A12',
    category: 'Données sensibles',
    question: 'Les données sensibles sont-elles traitées avec les précautions et autorisations requises ?',
    legalReference: 'Loi n° 2004-63, article 32',
    explanation: 'Les traitements de données sensibles demandent des garanties supplémentaires et une attention particulière à l’autorisation et au besoin d’accès.',
    evidence: 'Politique de traitement des données sensibles, accès restreints, autorisations internes.',
    status: 'À vérifier',
    riskLevel: 'Élevé',
    comments: 'Les dossiers de santé internes nécessitent un examen plus approfondi.'
  },
  {
    id: 'A13',
    category: 'Déclarations et autorisations INPDP',
    question: 'Les déclarations et autorisations auprès de l’INPDP sont-elles tenues à jour ?',
    legalReference: 'Loi n° 2004-63, dispositions relatives aux déclarations',
    explanation: 'Les obligations déclaratives doivent être vérifiées dans le cadre réglementaire applicable et selon la nature du traitement.',
    evidence: 'Copies des déclarations, suivi administratif, correspondance avec l’INPDP.',
    status: 'Partiellement conforme',
    riskLevel: 'Moyen',
    comments: 'La déclaration générale est conforme, mais certaines activités de traitement restent à valider.'
  },
  {
    id: 'A14',
    category: 'Documentation et procédures',
    question: 'Des procédures documentées et des formations sont-elles en place pour les équipes ?',
    legalReference: 'Loi n° 2004-63, principes de responsabilité proactive',
    explanation: 'La documentation et la sensibilisation interne sont essentielles pour démontrer le respect de la loi et la mise en œuvre des mesures de protection.',
    evidence: 'Procédures, plan de formation, attestations de sensibilisation.',
    status: 'Conforme',
    riskLevel: 'Faible',
    comments: 'Formations annuelles et procédures de traitement validées.'
  }
];

export const defaultSettings = {
  profile: {
    name: 'Mina Ben Ali',
    role: 'Auditrice en conformité',
    organization: 'Cabinet TuniSec Consulting'
  },
  theme: 'dark',
  dataWarning: 'Les données saisies dans cette démonstration sont à usage de test uniquement. Ne saisissez pas de données personnelles réelles ni de documents confidentiels.'
};

export const demoData = {
  settings: defaultSettings,
  audits: [
    {
      id: 'audit-001',
      title: 'Audit de conformité – Banque de détail',
      organizationName: 'Banque Tunisie Solidaire',
      sector: 'Finance',
      scope: 'Données clients, employés, fournisseurs et signalétiques de paiement',
      objectives: 'Évaluer le niveau de conformité du traitement des données à la loi tunisienne et proposer un plan d’action.',
      lead: 'Noura Bensalem',
      startDate: '2026-09-10',
      targetDate: '2026-10-28',
      status: 'En cours',
      notes: 'Audit piloté par le service conformité et le DPO interne.',
      checklist: defaultChecklist.map((item, index) => ({
        ...item,
        status: ['Conforme', 'Partiellement conforme', 'À vérifier', 'Conforme', 'Non conforme', 'Conforme'][index % 6],
        comments: index === 1 ? 'Excellente documentation des finalités.' : item.comments
      })),
      evidence: [
        {
          id: 'ev-001',
          title: 'Registre des traitements',
          description: 'Matrice des traitements et catégories de données enregistrées.',
          category: 'Documentation',
          date: '2026-09-15',
          itemId: 'A01',
          documentRef: 'REG-TRAIT/2026-09',
          notes: 'À mettre à jour suite à l’extension du périmètre CRM.'
        },
        {
          id: 'ev-002',
          title: 'Procédure de demande de droits',
          description: 'Formulaire de demande d’accès et de rectification.',
          category: 'Droits des personnes',
          date: '2026-09-18',
          itemId: 'A06',
          documentRef: 'PROC-DROITS/02',
          notes: 'Le délai de traitement doit être mieux traçé.'
        }
      ],
      findings: [
        {
          id: 'f-001',
          title: 'Accès privilégiés non revus',
          description: 'Une partie des comptes administrateurs n’a pas fait l’objet d’une revue trimestrielle des droits d’accès.',
          legalReference: 'A08',
          evidence: 'Journal d’accès et liste des comptes',
          riskLevel: 'Élevé',
          status: 'En cours',
          potentialImpact: 'Risque d’exposition non maîtrisée des données clients.',
          recommendedAction: 'Mettre en place un contrôle trimestriel des privilèges et une procédure d’attestation.',
          responsible: 'DPO / équipe sécurité',
          targetDate: '2026-10-25',
          acceptedRisk: false
        }
      ],
      risks: [
        {
          id: 'r-001',
          category: 'Accès et sécurité',
          likelihood: 3,
          impact: 4,
          score: 12,
          level: 'Élevé',
          controls: 'MFA, journaux, révision d’accès',
          mitigation: 'Renforcer la revue des comptes et la séparation des rôles.'
        }
      ],
      actions: [
        {
          id: 'a-001',
          title: 'Révision des accès privilégiés',
          description: 'Valider et réduire les droits d’accès administrateurs.',
          linkedFinding: 'f-001',
          responsible: 'Equipe sécurité',
          priority: 'Élevée',
          deadline: '2026-10-25',
          status: 'En cours',
          progress: 40,
          completionNotes: 'Premier lot de comptes revu. Reste un groupe à clôturer.'
        }
      ],
      report: {
        executiveSummary: 'La banque présente une base solide en matière de documentation et de sécurité, mais plusieurs points d’attention pèsent sur les droits des personnes et la revue des privilèges.',
        methodology: 'Évaluation documentaire, interviews, revue de logique de traitement et vérification d’évidence.',
        limitations: 'L’évaluation reste partielle et ne remplace pas une certification réglementaire ni un avis juridique exhaustif.',
        conclusion: 'Le programme de conformité doit être consolidé par la clôture des écarts sur les accès et l’exigence de traçabilité des demandes de droits.'
      }
    },
    {
      id: 'audit-002',
      title: 'Audit de conformité – Hôpital privé',
      organizationName: 'Clinique Sidi Salem',
      sector: 'Santé',
      scope: 'Dossiers médicaux, données de santé et accès aux services patients',
      objectives: 'Contrôler le respect du cadre légal sur les données de santé et les accès au SI hospitalier.',
      lead: 'Samir Aouini',
      startDate: '2026-08-20',
      targetDate: '2026-11-15',
      status: 'Planifié',
      notes: 'Mise en œuvre progressive du plan d’action après revue de la sécurité.',
      checklist: defaultChecklist.map((item, index) => ({
        ...item,
        status: ['Conforme', 'À vérifier', 'Non conforme', 'Conforme', 'Partiellement conforme', 'À vérifier'][index % 6]
      })),
      evidence: [],
      findings: [],
      risks: [],
      actions: [],
      report: {
        executiveSummary: 'Audit en prépa. Les éléments de fond sont en cours de collecte avant le dossier de synthèse.',
        methodology: 'Analyse documentaire et validation sur site des procédures de traitement des données de santé.',
        limitations: 'Le rapport final dépendra de la validité des preuves fournies par l’établissement.',
        conclusion: 'Une phase de collecte complémentaire est nécessaire avant de conclure sur l’état global de conformité.'
      }
    }
  ]
};
