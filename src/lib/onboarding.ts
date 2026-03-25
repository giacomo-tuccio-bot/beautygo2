export type OnboardingStepStatus = 'todo' | 'completed' | 'in_review' | 'approved' | 'rejected';

export type OnboardingStep = {
  key: 'base_profile' | 'fiscal_data' | 'services' | 'availability' | 'documents' | 'final_submission';
  order: number;
  title: string;
  description: string;
  status: OnboardingStepStatus;
};

export type ServiceRecord = {
  id: string;
  professional_id?: string;
  name: string | null;
  description?: string | null;
  duration_minutes?: number | null;
  price?: number | null;
  category?: string | null;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

export type AvailabilityRecord = {
  id: string;
  professional_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string | null;
};

export type DocumentRecord = {
  id: string;
  name: string;
  fileName?: string;
  uploadedAt?: string;
  status: 'missing' | 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

export type ProfileForOnboarding = {
  nome?: string | null;
  cognome?: string | null;
  telefono?: string | null;
  citta?: string | null;
  indirizzo?: string | null;
  bio?: string | null;
  tipoDocumentoFiscale?: string | null;
  valoreDocumentoFiscale?: string | null;
  intestatarioFatturazione?: string | null;
  partitaIvaFatturazione?: string | null;
  pec?: string | null;
  codiceDestinatario?: string | null;
  has_vat?: boolean | null;
  professional_status?: string | null;
};

const hasText = (value?: string | null) => Boolean(value?.trim());

export const isBaseProfileCompleted = (profile: ProfileForOnboarding) =>
  hasText(profile.nome) &&
  hasText(profile.cognome) &&
  hasText(profile.telefono) &&
  hasText(profile.citta) &&
  hasText(profile.indirizzo) &&
  hasText(profile.bio);

export const isFiscalDataCompleted = (profile: ProfileForOnboarding) => {
  const base =
    hasText(profile.tipoDocumentoFiscale) &&
    hasText(profile.valoreDocumentoFiscale) &&
    hasText(profile.intestatarioFatturazione);

  const delivery = hasText(profile.pec) || hasText(profile.codiceDestinatario);
  const vatOk = profile.has_vat ? hasText(profile.partitaIvaFatturazione) : true;
  return base && delivery && vatOk;
};

export const isValidService = (service: ServiceRecord) =>
  Boolean(
    service.is_active &&
      hasText(service.name) &&
      typeof service.duration_minutes === 'number' &&
      service.duration_minutes > 0 &&
      typeof service.price === 'number' &&
      service.price > 0
  );

export const getServicesStepStatus = (services: ServiceRecord[]): OnboardingStepStatus => {
  const valid = services.filter(isValidService);
  if (valid.length === 0) return 'todo';
  if (valid.every((service) => service.status === 'approved')) return 'approved';
  if (valid.some((service) => service.status === 'pending')) return 'in_review';
  if (valid.some((service) => service.status === 'rejected')) return 'rejected';
  return 'completed';
};

export const isAvailabilityCompleted = (availability: AvailabilityRecord[]) =>
  availability.some((slot) => slot.is_active && slot.start_time < slot.end_time);

export const getAvailabilityStepStatus = (availability: AvailabilityRecord[]): OnboardingStepStatus =>
  isAvailabilityCompleted(availability) ? 'completed' : 'todo';

/**
 * ID nuovi usati adesso in App.tsx / dashboard
 */
const requiredDocumentIds = ['identity_front', 'identity_back', 'tax_verification', 'cv'];
const portfolioDocumentIds = ['portfolio_1', 'portfolio_2', 'portfolio_3', 'portfolio_4', 'portfolio_5'];

/**
 * Step documenti completato quando:
 * - tutti i 4 documenti obbligatori hanno un file caricato
 * - NON richiediamo più obbligatoriamente una foto portfolio
 */
export const isDocumentsCompleted = (documents: DocumentRecord[]) => {
  return requiredDocumentIds.every((id) =>
    documents.some((doc) => doc.id === id && !!doc.fileName)
  );
};

export const getDocumentsStepStatus = (documents: DocumentRecord[]): OnboardingStepStatus => {
  if (!isDocumentsCompleted(documents)) return 'todo';

  const requiredDocuments = documents.filter((doc) => requiredDocumentIds.includes(doc.id));

  if (requiredDocuments.some((doc) => doc.status === 'rejected')) return 'rejected';

  if (requiredDocuments.every((doc) => doc.fileName && doc.status === 'approved')) {
    return 'approved';
  }

  if (requiredDocuments.some((doc) => doc.fileName && doc.status === 'pending')) {
    return 'in_review';
  }

  return 'completed';
};

export const buildOnboardingSteps = (
  profile: ProfileForOnboarding,
  services: ServiceRecord[],
  availability: AvailabilityRecord[],
  documents: DocumentRecord[] = []
): OnboardingStep[] => {
  const baseProfileStatus: OnboardingStepStatus = isBaseProfileCompleted(profile)
    ? 'completed'
    : 'todo';

  const fiscalStatus: OnboardingStepStatus = isFiscalDataCompleted(profile)
    ? 'completed'
    : 'todo';

  const servicesStatus = getServicesStepStatus(services);
  const availabilityStatus = getAvailabilityStepStatus(availability);
  const documentsStatus = getDocumentsStepStatus(documents);

  const finalSubmissionStatus: OnboardingStepStatus =
    profile.professional_status === 'approved'
      ? 'approved'
      : profile.professional_status === 'submitted'
      ? 'in_review'
      : [baseProfileStatus, fiscalStatus, servicesStatus, availabilityStatus, documentsStatus].every(
          (status) => ['completed', 'approved', 'in_review'].includes(status)
        )
      ? 'completed'
      : 'todo';

  return [
    {
      key: 'base_profile',
      order: 1,
      title: 'Profilo base',
      description: 'Nome, cognome, telefono, città, indirizzo e bio.',
      status: baseProfileStatus,
    },
    {
      key: 'fiscal_data',
      order: 2,
      title: 'Dati fiscali',
      description: 'Documento fiscale, intestazione e recapito fatturazione elettronica.',
      status: fiscalStatus,
    },
    {
      key: 'services',
      order: 3,
      title: 'Servizi',
      description: 'Almeno un servizio con nome, prezzo e durata.',
      status: servicesStatus,
    },
    {
      key: 'availability',
      order: 4,
      title: 'Disponibilità',
      description: 'Giorni e fasce orarie settimanali.',
      status: availabilityStatus,
    },
    {
      key: 'documents',
      order: 5,
      title: 'Documenti',
      description: 'Documento identità, verifica fiscale, CV e foto lavori.',
      status: documentsStatus,
    },
    {
      key: 'final_submission',
      order: 6,
      title: 'Invio finale',
      description: "Invia l'onboarding per la revisione admin.",
      status: finalSubmissionStatus,
    },
  ];
};

export const getProgressPercent = (steps: OnboardingStep[]) => {
  const done = steps.filter((step) =>
    ['completed', 'approved', 'in_review'].includes(step.status)
  );
  return Math.round((done.length / steps.length) * 100);
};
