import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';

const steps = [
  {
    title: 'Bienvenue dans TuniSec',
    description:
      'TuniSec est conçu pour aider les dirigeants de PME à mieux comprendre leurs données, leurs risques et les actions à mettre en place pour améliorer leur conformité.',
    points: [
      'Suivre un audit simple et progressif, sans jargon technique.',
      'Identifier les données qui sont collectées, utilisées et stockées.',
      'Préparer un plan d’action clair et priorisé.'
    ],
    highlight: 'Objectif principal : mieux piloter la conformité avec un cadre simple, lisible et utile pour l’entreprise.'
  },
  {
    title: 'Tableau de bord',
    description:
      'Le tableau de bord vous donne une vue d’ensemble de votre situation. Il montre l’état général de vos audits, les points sensibles et les actions qui demandent votre attention.',
    points: [
      'Suivez rapidement vos projets d’audit et leurs avancées.',
      'Repérez les écarts importants et les non-conformités.',
      'Priorisez facilement les actions à mettre en œuvre.'
    ],
    highlight: 'C’est la page d’accueil de votre pilotage : simple, rapide et orientée décision.'
  },
  {
    title: 'Profil de l’entreprise',
    description:
      'La première étape consiste à décrire votre organisation, son secteur d’activité et la personne responsable du projet. Cela permet d’adapter l’audit à votre réalité.',
    points: [
      'Renseignez le nom de votre structure et le responsable du projet.',
      'Définissez le périmètre de l’audit et les objectifs visés.',
      'Expliquez le contexte de votre activité pour obtenir un diagnostic utile.'
    ],
    highlight: 'Le contexte de l’entreprise est essentiel pour choisir les bonnes priorités et éviter de traiter tout de la même manière.'
  },
  {
    title: 'Gestion des traitements',
    description:
      'Identifiez les traitements de données personnelles concernés : clients, fournisseurs, salariés, dossiers internes, outils utilisés, fichiers partagés et données sensibles.',
    points: [
      'Mettez en lumière les types de données collectées et stockées.',
      'Évaluez où elles circulent et qui y a accès.',
      'Déterminez ce qui doit être renforcé pour limiter les risques.'
    ],
    highlight: 'Une PME n’a pas besoin d’être experte pour commencer : il suffit de repérer les flux de données sensibles.'
  },
  {
    title: 'Questionnaire d’audit',
    description:
      'Le questionnaire vous aide à examiner les pratiques de votre entreprise à travers des questions simples et concrètes. Il permet d’objectiver les points forts et les écarts.',
    points: [
      'Répondez selon votre situation actuelle, sans chercher la perfection.',
      'Notez les points à vérifier et les éléments manquants.',
      'Utilisez les explications proposées pour mieux comprendre chaque sujet.'
    ],
    highlight: 'L’objectif n’est pas d’obtenir un score parfait du premier coup, mais de poser les bonnes bases d’amélioration.'
  },
  {
    title: 'Écarts et risques',
    description:
      'Après le questionnaire, TuniSec aide à distinguer les écarts importants, les points de vigilance et les risques liés à la confidentialité, à la sécurité ou aux droits des personnes.',
    points: [
      'Concentrez-vous sur les éléments qui représentent un vrai risque.',
      'Priorisez par impact et par facilité de correction.',
      'Documentez les constats pour les partager avec votre équipe.'
    ],
    highlight: 'Il ne s’agit pas de tout corriger en même temps : il faut d’abord traiter les éléments les plus critiques.'
  },
  {
    title: 'Plan d’action',
    description:
      'Le plan d’action transforme les constats en actions concrètes, avec responsables, échéances et priorités. C’est la partie qui aide vraiment à avancer.',
    points: [
      'Fixez des actions simples, mesurables et réalistes.',
      'Attribuez les responsabilités à une personne claire.',
      'Suivez les progrès dans le temps pour rester aligné avec vos objectifs.'
    ],
    highlight: 'Un plan d’action utile est un plan réaliste : simple, priorisé et raisonnable pour votre structure.'
  },
  {
    title: 'Rapport final',
    description:
      'À la fin, TuniSec génère un rapport clair et professionnel, présentant les résultats, les écarts et les recommandations. Il peut servir de base de discussion interne ou de support de travail pour la prochaine étape.',
    points: [
      'Mettez en avant les risques et les priorités.',
      'Gardez un langage simple pour rassurer votre équipe.',
      'Utilisez le rapport comme support de suivi et de décision.'
    ],
    highlight: 'Le rapport n’a pas vocation à remplacer un conseil juridique spécialisé, mais il aide à structurer la réflexion et les actions à mettre en place.'
  }
];

export function OnboardingGuide() {
  const { settings, setSettings } = useAudit();
  const [currentStep, setCurrentStep] = useState(settings?.onboardingStep || 0);

  const step = steps[currentStep];

  const updateSettings = (nextStep, completed = false) => {
    setSettings({
      ...(settings || {}),
      onboardingStep: nextStep,
      onboardingCompleted: completed,
      onboardingOpen: false
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSettings({
        ...(settings || {}),
        onboardingStep: nextStep,
        onboardingCompleted: false,
        onboardingOpen: true
      });
      return;
    }

    updateSettings(steps.length - 1, true);
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      return;
    }

    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    setSettings({
      ...(settings || {}),
      onboardingStep: previousStep,
      onboardingCompleted: false,
      onboardingOpen: true
    });
  };

  const handleSkip = () => {
    updateSettings(currentStep, true);
  };

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Guide d’introduction TuniSec">
      <div className="onboarding-panel">
        <div className="onboarding-header">
          <div>
            <span className="eyebrow">Guide d’introduction</span>
            <h2>{step.title}</h2>
          </div>
          <button type="button" className="button button-secondary onboarding-close" onClick={handleSkip} aria-label="Fermer le guide">
            ✕
          </button>
        </div>

        <div className="onboarding-progress" aria-label="Progression du guide">
          {steps.map((item, index) => (
            <span key={item.title} className={index === currentStep ? 'active' : ''} />
          ))}
        </div>

        <p className="onboarding-text">{step.description}</p>

        <div className="onboarding-highlight">{step.highlight}</div>

        <ul className="onboarding-list">
          {step.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="onboarding-actions">
          <button type="button" className="button button-secondary" onClick={handlePrevious} disabled={currentStep === 0}>
            Précédent
          </button>
          <button type="button" className="button button-secondary" onClick={handleSkip}>
            Passer
          </button>
          <button type="button" className="button button-primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
