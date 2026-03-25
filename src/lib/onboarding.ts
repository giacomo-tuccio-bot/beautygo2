export function buildOnboardingSteps(
  profile: any,
  services: any[],
  availability: any[],
  documents: any[]
) {
  return [
    {
      key: 'base_profile',
      order: 1,
      title: 'Profilo base',
      description: 'Completa i dati anagrafici e la bio.',
      status: isBaseProfileCompleted(profile) ? 'completed' : 'todo',
    },
    {
      key: 'fiscal_data',
      order: 2,
      title: 'Dati fiscali',
      description: 'Inserisci i dati fiscali e di fatturazione.',
      status: isFiscalDataCompleted(profile) ? 'completed' : 'todo',
    },
    {
      key: 'services',
      order: 3,
      title: 'Servizi',
      description: 'Aggiungi almeno un servizio.',
      status: services.some(isValidService) ? 'completed' : 'todo',
    },
    {
      key: 'availability',
      order: 4,
      title: 'Disponibilità',
      description: 'Imposta giorni e orari disponibili.',
      status: isAvailabilityCompleted(availability) ? 'completed' : 'todo',
    },
    {
      key: 'documents',
      order: 5,
      title: 'Documenti',
      description: 'Carica documenti obbligatori, CV e portfolio.',
      status: (() => {
        const requiredIds = ['identity_front', 'identity_back', 'tax_verification', 'cv'];

        const requiredDocs = requiredIds.map((requiredId) =>
          documents.find((doc) => doc.id === requiredId)
        );

        const hasAllFiles = requiredDocs.every((doc) => !!doc?.fileName);

        if (!hasAllFiles) return 'todo';

        const hasRejected = requiredDocs.some((doc) => doc?.status === 'rejected');
        if (hasRejected) return 'rejected';

        const allApproved = requiredDocs.every((doc) => doc?.status === 'approved');
        if (allApproved) return 'approved';

        const hasPending = requiredDocs.some((doc) => doc?.status === 'pending');
        if (hasPending) return 'in_review';

        return 'completed';
      })(),
    },
  ];
}
