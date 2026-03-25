
import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import RegisterCustomerPage from './pages/RegisterCustomerPage';
import RegisterProfessionalPage from './pages/RegisterProfessionalPage';
import ProOnboardingPage, {
  type ProOnboardingFormData,
} from './pages/ProOnboardingPage';
import AdminPage from './pages/AdminPage';
import ProfessionalDetailPage from './pages/ProfessionalDetailPage';
import ServiceProfessionalsPage from './pages/ServiceProfessionalsPage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import ProfessionalOnboardingDashboard from './pages/ProfessionalOnboardingDashboard';
import { supabase } from './lib/supabase';
import type { AvailabilityRecord, ServiceRecord } from './lib/onboarding';
import CustomerProfilePage from './pages/CustomerProfilePage';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

type Screen =
  | 'tabs'
  | 'login'
  | 'registerCustomer'
  | 'registerProfessional'
  | 'verifyOtp'
  | 'proOnboarding'
  | 'professionalDetail'
  | 'serviceProfessionals';

type UserRole = 'guest' | 'customer' | 'professional' | 'admin';

export type ProfessionalProfileSection =
  | 'overview'
  | 'services'
  | 'pricing'
  | 'documents'
  | 'availability'
  | 'calendar'
  | 'requests'
  | 'info'
  | 'contracts';

export type DocumentStatus =
  | 'missing'
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected';

export type ProfessionalDocument = {
  id: string;
  name: string;
  fileName?: string;
  uploadedAt?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  downloadUrl?: string;
};

export type ProfessionalServiceItem = {
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
  rejectionReason?: string;
};

export type ProfessionalServicePrice = {
  service: string;
  price: string;
};

export type AvailabilityDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
};

export type AvailabilityDay = {
  key: AvailabilityDayKey;
  label: string;
  enabled: boolean;
  slots: AvailabilitySlot[];
};

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export type ProfessionalRequest = {
  id: string;
  customerName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  minutesLeft: number;
  status: RequestStatus;
};

export type ContractStatus =
  | 'locked'
  | 'uploaded_by_admin'
  | 'ready_for_signature'
  | 'signed';

export type ProfessionalContract = {
  contractType: 'vat' | 'tax_code';
  status: ContractStatus;
  fileName?: string;
  uploadedAt?: string;
  availableAt?: string;
  signedAt?: string;
};

export type ProfessionalAdminRequest = {
  id: string;
  createdAt: string;
};

export type ProfessionalProfileData = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  citta: string;
  indirizzo: string;
  tipoDocumentoFiscale: string;
  valoreDocumentoFiscale: string;
  intestatarioFatturazione: string;
  ragioneSociale: string;
  codiceFiscaleFatturazione: string;
  partitaIvaFatturazione: string;
  indirizzoFatturazione: string;
  cittaFatturazione: string;
  capFatturazione: string;
  provinciaFatturazione: string;
  pec: string;
  codiceDestinatario: string;
  bio: string;
  professional_status?: string;
  onboarding_completed?: boolean;
  submitted_at?: string;
  approved_at?: string;
};

type PersistedAppState = {
  professionalProfileData: ProfessionalProfileData;
  professionalCreatedAt: string;
  professionalProfileImageUrl?: string;
  fiscalEditUnlocked: boolean;
  fiscalChangeRequested: boolean;
  fiscalChangeRequestedAt?: string;
  fiscalChangeRequestNote?: string;
  adminRequests: ProfessionalAdminRequest[];
  professionalServices: ProfessionalServiceItem[];
  professionalDocuments: Omit<ProfessionalDocument, 'downloadUrl'>[];
  professionalServicePrices: ProfessionalServicePrice[];
  professionalAvailability: AvailabilityDay[];
  availabilitySaved: boolean;
  professionalRequests: ProfessionalRequest[];
  professionalContract: ProfessionalContract;
  professionalProfileSection: ProfessionalProfileSection;
};

type ServiceCatalogRecord = {
  id: string;
  name: string;
  category: string | null;
  default_duration: number | null;
};

type ProfileRecord = {
  id?: string;
  email?: string | null;
  role?: string | null;
  nome?: string | null;
  cognome?: string | null;
  telefono?: string | null;
  citta?: string | null;
  indirizzo?: string | null;
  tipoDocumentoFiscale?: string | null;
  valoreDocumentoFiscale?: string | null;
  intestatarioFatturazione?: string | null;
  ragioneSociale?: string | null;
  codiceFiscaleFatturazione?: string | null;
  partitaIvaFatturazione?: string | null;
  indirizzoFatturazione?: string | null;
  cittaFatturazione?: string | null;
  capFatturazione?: string | null;
  provinciaFatturazione?: string | null;
  pec?: string | null;
  codiceDestinatario?: string | null;
  bio?: string | null;
  professional_status?: string | null;
  onboarding_completed?: boolean | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  has_vat?: boolean | null;
  vat_rate?: number | null;
};

const STORAGE_KEY = 'beautygo-professional-workflow-v8';

const createAvailabilitySlot = (
  startTime = '09:00',
  endTime = '18:00',
  id?: string
): AvailabilitySlot => ({
  id: id ?? `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  startTime,
  endTime,
});

const defaultAvailability: AvailabilityDay[] = [
  { key: 'monday', label: 'Lunedì', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'tuesday', label: 'Martedì', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'wednesday', label: 'Mercoledì', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'thursday', label: 'Giovedì', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'friday', label: 'Venerdì', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'saturday', label: 'Sabato', enabled: false, slots: [createAvailabilitySlot()] },
  { key: 'sunday', label: 'Domenica', enabled: false, slots: [createAvailabilitySlot()] },
];

const defaultRequests: ProfessionalRequest[] = [
  {
    id: 'req-1',
    customerName: 'Giulia Rossi',
    serviceName: 'Piega',
    dateLabel: '12 Marzo 2026',
    timeLabel: '10:00',
    location: 'Milano',
    minutesLeft: 8,
    status: 'pending',
  },
  {
    id: 'req-2',
    customerName: 'Martina Bianchi',
    serviceName: 'Semipermanente',
    dateLabel: '12 Marzo 2026',
    timeLabel: '15:30',
    location: 'Monza',
    minutesLeft: 4,
    status: 'pending',
  },
  {
    id: 'req-3',
    customerName: 'Sara Verdi',
    serviceName: 'Trucco sera',
    dateLabel: '13 Marzo 2026',
    timeLabel: '18:00',
    location: 'Bergamo',
    minutesLeft: 0,
    status: 'expired',
  },
];

const emptyProfessionalProfileData: ProfessionalProfileData = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  citta: '',
  indirizzo: '',
  tipoDocumentoFiscale: 'piva',
  valoreDocumentoFiscale: '',
  intestatarioFatturazione: '',
  ragioneSociale: '',
  codiceFiscaleFatturazione: '',
  partitaIvaFatturazione: '',
  indirizzoFatturazione: '',
  cittaFatturazione: '',
  capFatturazione: '',
  provinciaFatturazione: '',
  pec: '',
  codiceDestinatario: '',
  bio: '',
  professional_status: 'draft',
  onboarding_completed: false,
  submitted_at: undefined,
  approved_at: undefined,
};

const createServiceId = (serviceName: string) =>
  `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getProfessionalStorageKey = (userId: string) => `${STORAGE_KEY}:${userId}`;

const createDefaultDocuments = (tipoDocumentoFiscale: string): ProfessionalDocument[] => {
  const fiscalDocumentName =
    tipoDocumentoFiscale === 'piva'
      ? 'Verifica Partita IVA'
      : 'Codice Fiscale / Tessera sanitaria';

  return [
    { id: 'identity-front', name: 'Documento identità fronte', status: 'missing' },
    { id: 'identity-back', name: 'Documento identità retro', status: 'missing' },
    { id: 'tax-document', name: fiscalDocumentName, status: 'missing' },
    { id: 'cv-document', name: 'Curriculum Vitae', status: 'missing' },
    { id: 'portfolio-1', name: 'Foto lavori 1', status: 'missing' },
    { id: 'portfolio-2', name: 'Foto lavori 2', status: 'missing' },
    { id: 'portfolio-3', name: 'Foto lavori 3', status: 'missing' },
  ];
};

const buildProfessionalProfileData = (
  source?: Partial<ProfessionalProfileData> | ProfileRecord | null,
  fallbackEmail?: string
): ProfessionalProfileData => ({
  ...emptyProfessionalProfileData,
  nome: source?.nome ?? '',
  cognome: source?.cognome ?? '',
  email: source?.email ?? fallbackEmail ?? '',
  telefono: source?.telefono ?? '',
  citta: source?.citta ?? '',
  indirizzo: source?.indirizzo ?? '',
  tipoDocumentoFiscale: source?.tipoDocumentoFiscale ?? 'piva',
  valoreDocumentoFiscale: source?.valoreDocumentoFiscale ?? '',
  intestatarioFatturazione: source?.intestatarioFatturazione ?? '',
  ragioneSociale: source?.ragioneSociale ?? '',
  codiceFiscaleFatturazione: source?.codiceFiscaleFatturazione ?? '',
  partitaIvaFatturazione: source?.partitaIvaFatturazione ?? '',
  indirizzoFatturazione: source?.indirizzoFatturazione ?? '',
  cittaFatturazione: source?.cittaFatturazione ?? '',
  capFatturazione: source?.capFatturazione ?? '',
  provinciaFatturazione: source?.provinciaFatturazione ?? '',
  pec: source?.pec ?? '',
  codiceDestinatario: source?.codiceDestinatario ?? '',
  bio: source?.bio ?? '',
  professional_status: source?.professional_status ?? 'draft',
  onboarding_completed: source?.onboarding_completed ?? false,
  submitted_at: source?.submitted_at ?? undefined,
  approved_at: source?.approved_at ?? undefined,
});


const normalizeAvailability = (availability?: unknown): AvailabilityDay[] => {
  if (!Array.isArray(availability) || availability.length === 0) {
    return defaultAvailability;
  }

  return availability.map((day, index) => {
    const fallback = defaultAvailability[index] ?? defaultAvailability[0];
    const rawDay = (day ?? {}) as Partial<AvailabilityDay> & {
      startTime?: string;
      endTime?: string;
      slots?: Array<Partial<AvailabilitySlot>>;
    };

    let slots: AvailabilitySlot[] = [];

    if (Array.isArray(rawDay.slots) && rawDay.slots.length > 0) {
      slots = rawDay.slots
        .slice(0, 3)
        .map((slot, slotIndex) =>
          createAvailabilitySlot(
            slot?.startTime ?? '09:00',
            slot?.endTime ?? '18:00',
            slot?.id ?? `${rawDay.key ?? fallback.key}-slot-${slotIndex + 1}`
          )
        );
    } else if (rawDay.startTime && rawDay.endTime) {
      slots = [
        createAvailabilitySlot(
          rawDay.startTime,
          rawDay.endTime,
          `${rawDay.key ?? fallback.key}-slot-1`
        ),
      ];
    } else {
      slots = fallback.slots.map((slot, slotIndex) =>
        createAvailabilitySlot(
          slot.startTime,
          slot.endTime,
          `${fallback.key}-slot-${slotIndex + 1}`
        )
      );
    }

    return {
      key: rawDay.key ?? fallback.key,
      label: rawDay.label ?? fallback.label,
      enabled: Boolean(rawDay.enabled),
      slots,
    };
  });
};

const getInitialPersistedState = (userId: string): PersistedAppState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(getProfessionalStorageKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAppState;

    return {
      professionalProfileData: buildProfessionalProfileData(parsed.professionalProfileData),
      professionalCreatedAt: parsed.professionalCreatedAt ?? '',
      professionalProfileImageUrl: parsed.professionalProfileImageUrl,
      fiscalEditUnlocked: Boolean(parsed.fiscalEditUnlocked),
      fiscalChangeRequested: Boolean(parsed.fiscalChangeRequested),
      fiscalChangeRequestedAt: parsed.fiscalChangeRequestedAt,
      fiscalChangeRequestNote: parsed.fiscalChangeRequestNote,
      adminRequests: Array.isArray(parsed.adminRequests) ? parsed.adminRequests : [],
      professionalServices: Array.isArray(parsed.professionalServices)
        ? parsed.professionalServices
        : [],
      professionalDocuments: Array.isArray(parsed.professionalDocuments)
        ? parsed.professionalDocuments.map((doc) => ({ ...doc, downloadUrl: undefined }))
        : [],
      professionalServicePrices: Array.isArray(parsed.professionalServicePrices)
        ? parsed.professionalServicePrices
        : [],
      professionalAvailability: normalizeAvailability(parsed.professionalAvailability),
      availabilitySaved: Boolean(parsed.availabilitySaved),
      professionalRequests:
        Array.isArray(parsed.professionalRequests) && parsed.professionalRequests.length > 0
          ? parsed.professionalRequests
          : defaultRequests,
      professionalContract: parsed.professionalContract ?? {
        contractType: 'vat',
        status: 'locked',
      },
      professionalProfileSection: parsed.professionalProfileSection ?? 'overview',
    };
  } catch {
    return null;
  }
};

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>('tabs');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [otpEmail, setOtpEmail] = useState('');
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingsInitialMacro, setBookingsInitialMacro] = useState('Tutte');

  const [professionalProfileSection, setProfessionalProfileSection] =
    useState<ProfessionalProfileSection>('overview');
  const [professionalProfileData, setProfessionalProfileData] =
    useState<ProfessionalProfileData>(emptyProfessionalProfileData);
  const [professionalStatus, setProfessionalStatus] = useState<string>('draft');
  const [professionalCreatedAt, setProfessionalCreatedAt] = useState<string>('');
  const [professionalProfileImageUrl, setProfessionalProfileImageUrl] = useState<
    string | undefined
  >(undefined);
  const [fiscalEditUnlocked, setFiscalEditUnlocked] = useState<boolean>(false);
  const [fiscalChangeRequested, setFiscalChangeRequested] = useState<boolean>(false);
  const [fiscalChangeRequestedAt, setFiscalChangeRequestedAt] = useState<string | undefined>(
    undefined
  );
  const [fiscalChangeRequestNote, setFiscalChangeRequestNote] = useState<string | undefined>(
    undefined
  );
  const [adminRequests, setAdminRequests] = useState<ProfessionalAdminRequest[]>([]);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalServiceItem[]>([]);
  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogRecord[]>([]);
  const [professionalDocuments, setProfessionalDocuments] = useState<ProfessionalDocument[]>([]);
  const [professionalServicePrices, setProfessionalServicePrices] = useState<
    ProfessionalServicePrice[]
  >([]);
  const [professionalAvailability, setProfessionalAvailability] = useState<AvailabilityDay[]>(
    defaultAvailability
  );
  const [availabilitySaved, setAvailabilitySaved] = useState(false);
  const [professionalRequests, setProfessionalRequests] = useState<ProfessionalRequest[]>(
    defaultRequests
  );
  const [professionalContract, setProfessionalContract] = useState<ProfessionalContract>({
    contractType: 'vat',
    status: 'locked',
  });

  const documentsRef = useRef<ProfessionalDocument[]>(professionalDocuments);
  const lastAuthSyncIdRef = useRef(0);

  useEffect(() => {
    documentsRef.current = professionalDocuments;
  }, [professionalDocuments]);

  useEffect(() => {
    return () => {
      documentsRef.current.forEach((doc) => {
        if (doc.downloadUrl) {
          URL.revokeObjectURL(doc.downloadUrl);
        }
      });
    };
  }, []);

  const resetProfessionalWorkflowState = (fallbackEmail = '') => {
    setProfessionalProfileSection('overview');
    setProfessionalProfileData(buildProfessionalProfileData(null, fallbackEmail));
    setProfessionalStatus('draft');
    setProfessionalCreatedAt('');
    setProfessionalProfileImageUrl(undefined);
    setFiscalEditUnlocked(false);
    setFiscalChangeRequested(false);
    setFiscalChangeRequestedAt(undefined);
    setFiscalChangeRequestNote(undefined);
    setAdminRequests([]);
    setProfessionalServices([]);
    setProfessionalDocuments([]);
    setProfessionalServicePrices([]);
    setProfessionalAvailability(defaultAvailability);
    setAvailabilitySaved(false);
    setProfessionalRequests(defaultRequests);
    setProfessionalContract({
      contractType: 'vat',
      status: 'locked',
    });
  };

  const hydrateProfessionalWorkflowState = (
    userId: string,
    user: User,
    profile: ProfileRecord | null
  ) => {
    const persisted = getInitialPersistedState(userId);

    if (persisted) {
      setProfessionalProfileSection(persisted.professionalProfileSection);
      setProfessionalProfileData(
        buildProfessionalProfileData(persisted.professionalProfileData, user.email ?? '')
      );
      setProfessionalStatus(profile?.professional_status ?? persisted.professionalProfileData.professional_status ?? 'draft');
      setProfessionalCreatedAt(persisted.professionalCreatedAt);
      setProfessionalProfileImageUrl(persisted.professionalProfileImageUrl);
      setFiscalEditUnlocked(persisted.fiscalEditUnlocked);
      setFiscalChangeRequested(persisted.fiscalChangeRequested);
      setFiscalChangeRequestedAt(persisted.fiscalChangeRequestedAt);
      setFiscalChangeRequestNote(persisted.fiscalChangeRequestNote);
      setAdminRequests(persisted.adminRequests);
      setProfessionalServices(persisted.professionalServices);
      setProfessionalDocuments(persisted.professionalDocuments);
      setProfessionalServicePrices(persisted.professionalServicePrices);
      setProfessionalAvailability(persisted.professionalAvailability);
      setAvailabilitySaved(persisted.availabilitySaved);
      setProfessionalRequests(persisted.professionalRequests);
      setProfessionalContract(persisted.professionalContract);
      return;
    }

    const initialProfile = buildProfessionalProfileData(profile, user.email ?? '');
    const tipoDocumento = initialProfile.tipoDocumentoFiscale || 'piva';

    setProfessionalProfileSection('overview');
    setProfessionalProfileData(initialProfile);
    setProfessionalStatus(profile?.professional_status ?? 'draft');
    setProfessionalCreatedAt(new Date().toISOString());
    setProfessionalProfileImageUrl(undefined);
    setFiscalEditUnlocked(false);
    setFiscalChangeRequested(false);
    setFiscalChangeRequestedAt(undefined);
    setFiscalChangeRequestNote(undefined);
    setAdminRequests([]);
    setProfessionalServices([]);
    setProfessionalDocuments(createDefaultDocuments(tipoDocumento));
    setProfessionalServicePrices([]);
    setProfessionalAvailability(defaultAvailability);
    setAvailabilitySaved(false);
    setProfessionalRequests(defaultRequests);
    setProfessionalContract({
      contractType: tipoDocumento === 'piva' ? 'vat' : 'tax_code',
      status: 'locked',
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionUserId || userRole !== 'professional') return;

    const stateToPersist: PersistedAppState = {
      professionalProfileData,
      professionalCreatedAt,
      professionalProfileImageUrl,
      fiscalEditUnlocked,
      fiscalChangeRequested,
      fiscalChangeRequestedAt,
      fiscalChangeRequestNote,
      adminRequests,
      professionalServices,
      professionalDocuments: professionalDocuments.map(({ downloadUrl, ...doc }) => doc),
      professionalServicePrices,
      professionalAvailability,
      availabilitySaved,
      professionalRequests,
      professionalContract,
      professionalProfileSection,
    };

    window.localStorage.setItem(
      getProfessionalStorageKey(sessionUserId),
      JSON.stringify(stateToPersist)
    );
  }, [
    sessionUserId,
    userRole,
    professionalProfileData,
    professionalCreatedAt,
    professionalProfileImageUrl,
    fiscalEditUnlocked,
    fiscalChangeRequested,
    fiscalChangeRequestedAt,
    fiscalChangeRequestNote,
    adminRequests,
    professionalServices,
    professionalDocuments,
    professionalServicePrices,
    professionalAvailability,
    availabilitySaved,
    professionalRequests,
    professionalContract,
    professionalProfileSection,
  ]);


  const loadServiceCatalog = async () => {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Errore caricamento catalogo servizi:', error);
      setServiceCatalog([]);
      return;
    }

    setServiceCatalog((data ?? []) as ServiceCatalogRecord[]);
  };

  const loadProfessionalServices = async (userId: string) => {
    const { data, error } = await supabase
      .from('professional_services')
      .select('*')
      .eq('professional_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Errore caricamento servizi professionista:', error);
      return;
    }

    setProfessionalServices((data ?? []) as ServiceRecord[]);
  };

  const loadProfessionalAvailability = async (userId: string) => {
    const { data, error } = await supabase
      .from('professional_availability')
      .select('*')
      .eq('professional_id', userId)
      .eq('is_active', true)
      .order('weekday', { ascending: true });

    if (error) {
      console.error('Errore caricamento disponibilità professionista:', error);
      return;
    }

    const availabilityRows = (data ?? []) as AvailabilityRecord[];
    const dayMap: Record<AvailabilityDayKey, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    setProfessionalAvailability(
      defaultAvailability.map((day) => {
        const slots = availabilityRows
          .filter((row) => row.weekday === dayMap[day.key])
          .map((row) => createAvailabilitySlot(row.start_time.slice(0, 5), row.end_time.slice(0, 5), row.id));

        return {
          ...day,
          enabled: slots.length > 0,
          slots: slots.length > 0 ? slots : day.slots,
        };
      })
    );
    setAvailabilitySaved(availabilityRows.length > 0);
  };

  const refreshProfessionalData = async (userId: string) => {
    await Promise.all([loadProfessionalServices(userId), loadProfessionalAvailability(userId)]);
  };

  useEffect(() => {
    void loadServiceCatalog();
  }, []);

  const upsertProfileSafely = async (
    payload: Record<string, unknown>,
    fallbackRole: UserRole
  ): Promise<void> => {
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

    if (!error) return;

    const minimalPayload: Record<string, unknown> = {
      id: payload.id,
      email: payload.email,
      role: fallbackRole,
    };

    const { error: fallbackError } = await supabase
      .from('profiles')
      .upsert(minimalPayload, { onConflict: 'id' });

    if (fallbackError) {
      throw fallbackError;
    }
  };

  const fetchOrCreateProfile = async (
    user: User
  ): Promise<{ role: UserRole; profile: ProfileRecord | null }> => {
    const email = (user.email ?? '').trim().toLowerCase();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      let normalizedRole: UserRole = 'customer';

      if (data.role === 'professional') normalizedRole = 'professional';
      else if (data.role === 'admin') normalizedRole = 'admin';
      else if (data.role === 'customer') normalizedRole = 'customer';
      else {
        const fallbackRole: UserRole =
          user.user_metadata?.role === 'professional'
            ? 'professional'
            : user.user_metadata?.role === 'admin'
            ? 'admin'
            : 'customer';

        await upsertProfileSafely(
          {
            id: user.id,
            email: data.email ?? email,
            role: fallbackRole,
          },
          fallbackRole
        );

        normalizedRole = fallbackRole;
      }

      return {
        role: normalizedRole,
        profile: data as ProfileRecord,
      };
    }

    const { data: pending, error: pendingError } = await supabase
      .from('pending_registrations')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (pendingError) {
      console.error('Errore lettura pending_registrations:', pendingError);
    }

    const pendingRole: UserRole | null =
      pending?.role === 'professional'
        ? 'professional'
        : pending?.role === 'admin'
        ? 'admin'
        : pending?.role === 'customer'
        ? 'customer'
        : null;

    const metadataRole: UserRole | null =
      user.user_metadata?.role === 'professional'
        ? 'professional'
        : user.user_metadata?.role === 'admin'
        ? 'admin'
        : user.user_metadata?.role === 'customer'
        ? 'customer'
        : null;

    const resolvedRole: UserRole = pendingRole ?? metadataRole ?? 'customer';

    const createdProfile: ProfileRecord = {
      id: user.id,
      email,
      role: resolvedRole,
      nome: pending?.nome ?? null,
      cognome: pending?.cognome ?? null,
      telefono: pending?.telefono ?? null,
      citta: pending?.citta ?? null,
      indirizzo: pending?.indirizzo ?? null,
      tipoDocumentoFiscale: pending?.tipoDocumentoFiscale ?? null,
      valoreDocumentoFiscale: pending?.valoreDocumentoFiscale ?? null,
      intestatarioFatturazione: pending?.intestatarioFatturazione ?? null,
      ragioneSociale: pending?.ragioneSociale ?? null,
      codiceFiscaleFatturazione: pending?.codiceFiscaleFatturazione ?? null,
      partitaIvaFatturazione: pending?.partitaIvaFatturazione ?? null,
      indirizzoFatturazione: pending?.indirizzoFatturazione ?? null,
      cittaFatturazione: pending?.cittaFatturazione ?? null,
      capFatturazione: pending?.capFatturazione ?? null,
      provinciaFatturazione: pending?.provinciaFatturazione ?? null,
      pec: pending?.pec ?? null,
      codiceDestinatario: pending?.codiceDestinatario ?? null,
    };

    await upsertProfileSafely(createdProfile, resolvedRole);

    if (pending?.email) {
      const { error: deletePendingError } = await supabase
        .from('pending_registrations')
        .delete()
        .eq('email', email);

      if (deletePendingError) {
        console.error('Errore cancellazione pending_registrations:', deletePendingError);
      }
    }

    return {
      role: resolvedRole,
      profile: createdProfile,
    };
  };

  const applyGuestState = () => {
    setSessionUserId(null);
    setUserRole('guest');
    setScreen('tabs');
    setTab('profile');
    resetProfessionalWorkflowState();
    setOtpEmail('');
    setAuthReady(true);
  };

  const syncAuthenticatedUser = async (user: User) => {
    const syncId = ++lastAuthSyncIdRef.current;

    try {
      const { role, profile } = await fetchOrCreateProfile(user);

      if (syncId !== lastAuthSyncIdRef.current) return;

      setSessionUserId(user.id);
      setUserRole(role);

      if (role === 'professional') {
        hydrateProfessionalWorkflowState(user.id, user, profile);
        await refreshProfessionalData(user.id);
      } else {
        resetProfessionalWorkflowState(user.email ?? '');
      }

      setScreen('tabs');
      setTab('profile');
    } catch (error) {
      console.error('Errore sincronizzazione auth/profiles:', error);
      applyGuestState();
      return;
    }

    setAuthReady(true);
  };

  const bootstrapAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        applyGuestState();
        return;
      }

      await syncAuthenticatedUser(session.user);
    } catch (error) {
      console.error('Errore bootstrap auth:', error);
      applyGuestState();
    }
  };

  useEffect(() => {
    void bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        applyGuestState();
        return;
      }

      void syncAuthenticatedUser(session.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleTabChange = (nextTab: Tab) => {
    if (nextTab !== 'bookings') {
      setBookingsInitialMacro('Tutte');
    }

    setTab(nextTab);
    setScreen('tabs');
  };

  const handleUploadProfessionalProfileImage = async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setProfessionalProfileImageUrl(dataUrl);
      alert('Foto profilo aggiornata.');
    } catch {
      alert('Errore durante il caricamento della foto profilo.');
    }
  };

  const handleRemoveProfessionalProfileImage = () => {
    setProfessionalProfileImageUrl(undefined);
    alert('Foto profilo rimossa.');
  };

  const handleUploadProfessionalDocument = (documentId: string, file: File) => {
    const nextUrl = URL.createObjectURL(file);

    setProfessionalDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;

        if (doc.downloadUrl) {
          URL.revokeObjectURL(doc.downloadUrl);
        }

        return {
          ...doc,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          status: 'draft',
          rejectionReason: undefined,
          downloadUrl: nextUrl,
        };
      })
    );
  };

  const handleRemoveProfessionalDocument = (documentId: string) => {
    setProfessionalDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;

        if (doc.downloadUrl) {
          URL.revokeObjectURL(doc.downloadUrl);
        }

        return {
          ...doc,
          fileName: undefined,
          uploadedAt: undefined,
          status: 'missing',
          rejectionReason: undefined,
          downloadUrl: undefined,
        };
      })
    );
  };

  const handleDownloadProfessionalDocument = (documentId: string) => {
    const target = professionalDocuments.find((doc) => doc.id === documentId);

    if (!target?.downloadUrl || !target.fileName) {
      alert(
        'Questo file non è disponibile dopo il refresh. Ricaricalo oppure usa Supabase Storage nel prossimo step.'
      );
      return;
    }

    const link = document.createElement('a');
    link.href = target.downloadUrl;
    link.download = target.fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitDocuments = () => {
    const hasUploadedDocuments = professionalDocuments.some((doc) => !!doc.fileName);

    if (!hasUploadedDocuments) {
      alert('Carica almeno un documento prima di inviarlo per verifica.');
      return;
    }

    setProfessionalDocuments((prev) =>
      prev.map((doc) =>
        doc.fileName
          ? {
              ...doc,
              status: 'pending',
              rejectionReason: undefined,
            }
          : doc
      )
    );

    alert('Documenti inviati correttamente per verifica.');
  };

  const handlePriceChange = (service: string, price: string) => {
    setProfessionalServicePrices((prev) => {
      const existing = prev.find((item) => item.service === service);

      if (existing) {
        return prev.map((item) => (item.service === service ? { ...item, price } : item));
      }

      return [...prev, { service, price }];
    });
  };

  const approvedServices = professionalServices.filter((service) => service.status === 'approved');
  const hasApprovedServices = approvedServices.length > 0;

  const handleSavePrices = () => {
    if (!hasApprovedServices) {
      alert('I prezzi saranno disponibili solo dopo approvazione dei servizi.');
      return;
    }

    alert('Listino salvato correttamente.');
  };

  const handleToggleAvailabilityDay = (dayKey: AvailabilityDayKey) => {
    setProfessionalAvailability((prev) =>
      prev.map((day) => (day.key === dayKey ? { ...day, enabled: !day.enabled } : day))
    );
    setAvailabilitySaved(false);
  };

  const handleAvailabilityTimeChange = (
    dayKey: AvailabilityDayKey,
    slotId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setProfessionalAvailability((prev) =>
      prev.map((day) =>
        day.key === dayKey
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
    setAvailabilitySaved(false);
  };

  const handleAddAvailabilitySlot = (dayKey: AvailabilityDayKey) => {
    setProfessionalAvailability((prev) =>
      prev.map((day) =>
        day.key === dayKey && day.slots.length < 3
          ? {
              ...day,
              slots: [...day.slots, createAvailabilitySlot('14:00', '18:00')],
            }
          : day
      )
    );
    setAvailabilitySaved(false);
  };

  const handleRemoveAvailabilitySlot = (dayKey: AvailabilityDayKey, slotId: string) => {
    setProfessionalAvailability((prev) =>
      prev.map((day) => {
        if (day.key !== dayKey) return day;

        const updatedSlots = day.slots.filter((slot) => slot.id !== slotId);

        return {
          ...day,
          slots:
            updatedSlots.length > 0
              ? updatedSlots
              : [createAvailabilitySlot('09:00', '18:00')],
        };
      })
    );
    setAvailabilitySaved(false);
  };

  const handleSaveAvailability = () => {
    const activeDays = professionalAvailability.filter((day) => day.enabled);

    if (activeDays.length === 0) {
      alert('Seleziona almeno un giorno lavorativo.');
      return;
    }

    const hasInvalidTimeRange = activeDays.some((day) =>
      day.slots.some((slot) => slot.startTime >= slot.endTime)
    );

    if (hasInvalidTimeRange) {
      alert("Controlla gli orari: l'orario di fine deve essere successivo a quello di inizio.");
      return;
    }

    const hasOverlappingSlots = activeDays.some((day) => {
      const sortedSlots = [...day.slots].sort((a, b) => a.startTime.localeCompare(b.startTime));

      for (let index = 1; index < sortedSlots.length; index += 1) {
        if (sortedSlots[index].startTime < sortedSlots[index - 1].endTime) {
          return true;
        }
      }

      return false;
    });

    if (hasOverlappingSlots) {
      alert('Controlla le fasce orarie: non devono sovrapporsi nello stesso giorno.');
      return;
    }

    setAvailabilitySaved(true);
    alert('Disponibilità lavorativa salvata correttamente.');
  };

  const handleAcceptRequest = (requestId: string) => {
    setProfessionalRequests((prev) =>
      prev.map((request) =>
        request.id === requestId && request.status === 'pending'
          ? { ...request, status: 'accepted' }
          : request
      )
    );
    alert('Richiesta accettata.');
  };

  const handleRejectRequest = (requestId: string) => {
    setProfessionalRequests((prev) =>
      prev.map((request) =>
        request.id === requestId && request.status === 'pending'
          ? { ...request, status: 'rejected' }
          : request
      )
    );
    alert('Richiesta rifiutata.');
  };

  const requiredDocumentsApproved = useMemo(() => {
    const requiredIds = ['identity-document', 'tax-document', 'professional-certificate'];

    return requiredIds.every((requiredId) =>
      professionalDocuments.some((doc) => doc.id === requiredId && doc.status === 'approved')
    );
  }, [professionalDocuments]);

  const contractsUnlocked = hasApprovedServices && requiredDocumentsApproved;

  const isProfileActive =
    hasApprovedServices &&
    requiredDocumentsApproved &&
    availabilitySaved &&
    professionalContract.status === 'signed';

  const handleAdminApproveService = (serviceId: string) => {
    const target = professionalServices.find((service) => service.id === serviceId);

    if (!target) {
      alert('Servizio non trovato.');
      return;
    }

    setProfessionalServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: 'approved',
              rejectionReason: undefined,
            }
          : service
      )
    );

    alert('Servizio approvato.');
  };

  const handleAdminRejectService = (serviceId: string) => {
    const target = professionalServices.find((service) => service.id === serviceId);

    if (!target) {
      alert('Servizio non trovato.');
      return;
    }

    setProfessionalServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: 'rejected',
              rejectionReason: 'Servizio non conforme',
            }
          : service
      )
    );

    alert('Servizio rifiutato.');
  };

  const handleAdminApproveDocument = (documentId: string) => {
    setProfessionalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId && doc.fileName
          ? {
              ...doc,
              status: 'approved',
              rejectionReason: undefined,
            }
          : doc
      )
    );

    alert('Documento approvato.');
  };

  const handleAdminRejectDocument = (documentId: string) => {
    setProfessionalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId && doc.fileName
          ? {
              ...doc,
              status: 'rejected',
              rejectionReason: 'Documento non conforme',
            }
          : doc
      )
    );

    alert('Documento rifiutato.');
  };

  const handleAdminUploadContract = (fileName: string) => {
    setProfessionalContract((prev) => ({
      ...prev,
      fileName,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded_by_admin',
      availableAt: undefined,
      signedAt: undefined,
    }));

    alert('Contratto caricato da admin.');
  };

  const handleAdminMakeContractReady = () => {
    if (!professionalContract.fileName) {
      alert('Carica prima il contratto.');
      return;
    }

    setProfessionalContract((prev) => ({
      ...prev,
      status: 'ready_for_signature',
      availableAt: new Date().toISOString(),
    }));

    alert('Contratto reso disponibile alla firma.');
  };

  const handleSendContractOtp = () => {
    if (professionalContract.status !== 'ready_for_signature') {
      alert('Il contratto non è pronto per l’invio OTP.');
      return;
    }

    alert('OTP inviato via SMS per la firma digitale.');
  };

  const handleMarkContractSigned = () => {
    if (professionalContract.status !== 'ready_for_signature') {
      alert('Il contratto non è nello stato corretto per essere firmato.');
      return;
    }

    setProfessionalContract((prev) => ({
      ...prev,
      status: 'signed',
      signedAt: new Date().toISOString(),
    }));

    alert('Contratto firmato correttamente.');
  };

  const handleAdminUnlockFiscalEdit = () => {
    setFiscalEditUnlocked(true);
    setFiscalChangeRequested(false);
    alert('Modifica fiscale sbloccata per il professionista.');
  };

  const handleAdminLockFiscalEdit = () => {
    setFiscalEditUnlocked(false);
    alert('Modifica fiscale ribloccata.');
  };

  const handleLogout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert(error.message);
        return;
      }
    }

    applyGuestState();
  };

  const handleProfessionalOnboardingComplete = async (data: ProOnboardingFormData) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      alert('Utente non autenticato. Fai di nuovo login.');
      setScreen('login');
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('Sessione non valida. Fai di nuovo login.');
      setScreen('login');
      return;
    }

    const nowIso = new Date().toISOString();

    const profilePayload: Record<string, unknown> = {
      id: user.id,
      email: data.email.trim(),
      role: 'professional',
      nome: data.nome.trim(),
      cognome: data.cognome.trim(),
      telefono: data.telefono.trim(),
      citta: data.citta.trim(),
      indirizzo: data.indirizzo.trim(),
      tipoDocumentoFiscale: data.tipoDocumentoFiscale,
      valoreDocumentoFiscale: data.valoreDocumentoFiscale.trim(),
      intestatarioFatturazione: data.intestatarioFatturazione.trim(),
      ragioneSociale: data.ragioneSociale.trim(),
      codiceFiscaleFatturazione: data.codiceFiscaleFatturazione.trim(),
      partitaIvaFatturazione: data.partitaIvaFatturazione.trim(),
      indirizzoFatturazione: data.indirizzoFatturazione.trim(),
      cittaFatturazione: data.cittaFatturazione.trim(),
      capFatturazione: data.capFatturazione.trim(),
      provinciaFatturazione: data.provinciaFatturazione.trim(),
      pec: data.pec.trim(),
      codiceDestinatario: data.codiceDestinatario.trim(),
      bio: data.bio.trim(),
      professional_status: 'draft',
      onboarding_completed: false,
      updated_at: nowIso,
    };

    try {
      await upsertProfileSafely(profilePayload, 'professional');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore aggiornamento profilo.';
      alert(message);
      return;
    }

    setSessionUserId(user.id);
    setUserRole('professional');
    setProfessionalProfileData(buildProfessionalProfileData(data, user.email ?? ''));
    setProfessionalStatus('draft');
    setProfessionalCreatedAt(nowIso);
    setProfessionalProfileImageUrl(undefined);
    setFiscalEditUnlocked(false);
    setFiscalChangeRequested(false);
    setFiscalChangeRequestedAt(undefined);
    setFiscalChangeRequestNote(undefined);
    setAdminRequests([{ id: `professional-${user.id}`, createdAt: nowIso }]);
    setProfessionalServices([]);
    setProfessionalDocuments(createDefaultDocuments(data.tipoDocumentoFiscale));
    setProfessionalServicePrices([]);
    setProfessionalAvailability(defaultAvailability);
    setAvailabilitySaved(false);
    setProfessionalRequests(defaultRequests);
    setProfessionalContract({
      contractType: data.tipoDocumentoFiscale === 'piva' ? 'vat' : 'tax_code',
      status: 'locked',
      fileName: undefined,
      uploadedAt: undefined,
      availableAt: undefined,
      signedAt: undefined,
    });
    setProfessionalProfileSection('overview');
    setScreen('tabs');
    setTab('profile');
  };

  const renderProfessionalProfile = () => (
    <ProfessionalProfilePage
      profileData={professionalProfileData}
      activeSection={professionalProfileSection}
      professionalServices={professionalServices}
      professionalDocuments={professionalDocuments}
      professionalServicePrices={professionalServicePrices}
      professionalAvailability={professionalAvailability}
      availabilitySaved={availabilitySaved}
      professionalRequests={professionalRequests}
      professionalContract={professionalContract}
      contractsUnlocked={contractsUnlocked}
      isProfileActive={isProfileActive}
      professionalProfileImageUrl={professionalProfileImageUrl}
      fiscalEditUnlocked={fiscalEditUnlocked}
      fiscalChangeRequested={fiscalChangeRequested}
      fiscalChangeRequestedAt={fiscalChangeRequestedAt}
      fiscalChangeRequestNote={fiscalChangeRequestNote}
      onLogout={handleLogout}
      onRequestFiscalChange={(note) => {
        setFiscalChangeRequested(true);
        setFiscalChangeRequestedAt(new Date().toISOString());
        setFiscalChangeRequestNote(note || '');
        alert('Richiesta inviata correttamente all’amministrazione.');
      }}
      onUploadProfessionalProfileImage={handleUploadProfessionalProfileImage}
      onRemoveProfessionalProfileImage={handleRemoveProfessionalProfileImage}
      onSaveProfileData={(data) => {
        setProfessionalProfileData((prev) => buildProfessionalProfileData({ ...prev, ...data }));

        if (fiscalEditUnlocked) {
          setFiscalEditUnlocked(false);
          setFiscalChangeRequested(false);
          setFiscalChangeRequestedAt(undefined);
          setFiscalChangeRequestNote(undefined);
        }
      }}
      onBack={() => {
        setProfessionalProfileSection('overview');
        setScreen('tabs');
      }}
      onOpenSection={(section) => setProfessionalProfileSection(section)}
      onToggleService={(serviceName) => {
        setProfessionalServices((prev) => {
          const existing = prev.find((service) => service.name === serviceName);
          const updated = existing
            ? prev.filter((service) => service.name !== serviceName)
            : [
                ...prev,
                {
                  id: createServiceId(serviceName),
                  name: serviceName,
                  status: 'draft' as const,
                },
              ];

          setProfessionalServicePrices((currentPrices) =>
            currentPrices.filter((item) => updated.some((service) => service.name === item.service))
          );

          return updated;
        });
      }}
      onSubmitServices={() => {
        if (professionalServices.length === 0) {
          alert('Seleziona almeno un servizio prima di inviarlo.');
          return;
        }

        setProfessionalServices((prev) =>
          prev.map((service) =>
            service.status === 'approved'
              ? service
              : {
                  ...service,
                  status: 'pending',
                  rejectionReason: undefined,
                }
          )
        );

        setProfessionalContract((prev) => ({
          ...prev,
          status: 'locked',
          fileName: undefined,
          uploadedAt: undefined,
          availableAt: undefined,
          signedAt: undefined,
        }));

        setAdminRequests((prev) => {
          const nowIso = new Date().toISOString();
          return [{ id: `professional-${sessionUserId ?? 'current'}`, createdAt: nowIso }, ...prev];
        });

        alert('Servizi inviati correttamente per verifica.');
      }}
      onUploadProfessionalDocument={handleUploadProfessionalDocument}
      onRemoveProfessionalDocument={handleRemoveProfessionalDocument}
      onDownloadProfessionalDocument={handleDownloadProfessionalDocument}
      onSubmitDocuments={handleSubmitDocuments}
      onPriceChange={handlePriceChange}
      onSavePrices={handleSavePrices}
      onToggleAvailabilityDay={handleToggleAvailabilityDay}
      onAvailabilityTimeChange={handleAvailabilityTimeChange}
      onAddAvailabilitySlot={handleAddAvailabilitySlot}
      onRemoveAvailabilitySlot={handleRemoveAvailabilitySlot}
      onSaveAvailability={handleSaveAvailability}
      onAcceptRequest={handleAcceptRequest}
      onRejectRequest={handleRejectRequest}
      onSendContractOtp={handleSendContractOtp}
      onMarkContractSigned={handleMarkContractSigned}
      currentTab={tab}
      onChangeTab={(nextTab) => {
        if (nextTab !== 'bookings') {
          setBookingsInitialMacro('Tutte');
        }
        setProfessionalProfileSection('overview');
        setTab(nextTab);
        setScreen('tabs');
      }}
    />
  );

  const renderProfileTab = () => {
    if (userRole === 'admin') {
      return (
        <AdminPage
          currentTab={tab}
          onChangeTab={handleTabChange}
          approvalRequests={[]}
          fiscalEditUnlocked={fiscalEditUnlocked}
          onApproveService={handleAdminApproveService}
          onRejectService={handleAdminRejectService}
          onApproveDocument={handleAdminApproveDocument}
          onRejectDocument={handleAdminRejectDocument}
          onDownloadDocument={handleDownloadProfessionalDocument}
          onUploadContract={handleAdminUploadContract}
          onMakeContractReady={handleAdminMakeContractReady}
          onUnlockFiscalEdit={handleAdminUnlockFiscalEdit}
          onLockFiscalEdit={handleAdminLockFiscalEdit}
          onLogout={handleLogout}
        />
      );
    }

    if (userRole === 'customer') {
      return (
        <CustomerProfilePage currentTab={tab} onChangeTab={handleTabChange} onLogout={handleLogout} />
      );
    }

    if (userRole === 'professional') {
      if (professionalStatus !== 'approved') {
        return (
          <ProfessionalOnboardingDashboard
            currentTab={tab}
            onChangeTab={handleTabChange}
            profile={professionalProfileData}
            services={professionalServices}
            documents={professionalDocuments}
            serviceCatalog={serviceCatalog}
            availability={professionalAvailability
              .filter((day) => day.enabled)
              .flatMap((day) => {
                const weekdayMap: Record<AvailabilityDayKey, number> = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
                return day.slots.map((slot) => ({
                  id: slot.id,
                  professional_id: sessionUserId ?? '',
                  weekday: weekdayMap[day.key],
                  start_time: slot.startTime,
                  end_time: slot.endTime,
                  is_active: true,
                  created_at: null,
                }));
              })}
            onSaveBaseProfile={async (payload) => {
              if (!sessionUserId) return;
              const { error } = await supabase.from('profiles').update({
                nome: payload.nome?.trim() ?? '',
                cognome: payload.cognome?.trim() ?? '',
                telefono: payload.telefono?.trim() ?? '',
                citta: payload.citta?.trim() ?? '',
                indirizzo: payload.indirizzo?.trim() ?? '',
                bio: payload.bio?.trim() ?? '',
                updated_at: new Date().toISOString(),
              }).eq('id', sessionUserId);
              if (error) throw error;
              setProfessionalProfileData((prev) => buildProfessionalProfileData({ ...prev, ...payload, professional_status: professionalStatus }));
              alert('Profilo base salvato.');
            }}
            onSaveFiscalData={async (payload) => {
              if (!sessionUserId) return;
              const nextType = payload.tipoDocumentoFiscale?.trim() || 'piva';
              const { error } = await supabase.from('profiles').update({
                tipoDocumentoFiscale: nextType,
                valoreDocumentoFiscale: payload.valoreDocumentoFiscale?.trim() ?? '',
                intestatarioFatturazione: payload.intestatarioFatturazione?.trim() ?? '',
                partitaIvaFatturazione: payload.partitaIvaFatturazione?.trim() ?? '',
                pec: payload.pec?.trim() ?? '',
                codiceDestinatario: payload.codiceDestinatario?.trim() ?? '',
                has_vat: nextType === 'piva',
                updated_at: new Date().toISOString(),
              }).eq('id', sessionUserId);
              if (error) throw error;
              setProfessionalProfileData((prev) => buildProfessionalProfileData({ ...prev, ...payload, tipoDocumentoFiscale: nextType }));
              alert('Dati fiscali salvati.');
            }}
            onCreateService={async (payload) => {
              if (!sessionUserId) return;

              const selected = serviceCatalog.find((item) => item.id === payload.catalog_id);
              if (!selected) {
                throw new Error('Seleziona un servizio dal catalogo.');
              }

              const duration = Number(payload.duration_minutes);
              const price = Number(payload.price);

              if (!Number.isFinite(duration) || duration <= 0) {
                throw new Error('Durata servizio non valida.');
              }

              if (!Number.isFinite(price) || price <= 0) {
                throw new Error('Inserisci un prezzo valido.');
              }

              const description = payload.description.trim() || null;
              const insertAttempts = [
                {
                  professional_id: sessionUserId,
                  catalog_id: selected.id,
                  name: selected.name,
                  description,
                  duration_minutes: duration,
                  price,
                  category: selected.category ?? null,
                  status: 'draft',
                  is_active: true,
                },
                {
                  professional_id: sessionUserId,
                  name: selected.name,
                  description,
                  duration_minutes: duration,
                  price,
                  category: selected.category ?? null,
                  status: 'draft',
                  is_active: true,
                },
                {
                  professional_id: sessionUserId,
                  name: selected.name,
                  description,
                  duration_minutes: duration,
                  price,
                  category: selected.category ?? null,
                  is_active: true,
                },
                {
                  professional_id: sessionUserId,
                  name: selected.name,
                  duration_minutes: duration,
                  price,
                },
              ];

              let lastError: any = null;

              for (const attempt of insertAttempts) {
                const response = await supabase.from('professional_services').insert(attempt);
                if (!response.error) {
                  await loadProfessionalServices(sessionUserId);
                  alert('Servizio aggiunto.');
                  return;
                }
                lastError = response.error;
              }

              console.error('Errore inserimento servizio:', lastError);
              throw new Error(lastError?.message || 'Impossibile aggiungere il servizio.');
            }}
            onDeleteService={async (serviceId) => {
              const { error } = await supabase.from('professional_services').delete().eq('id', serviceId);
              if (error) throw error;
              if (sessionUserId) await loadProfessionalServices(sessionUserId);
              alert('Servizio eliminato.');
            }}
            onSubmitServices={async () => {
              if (!sessionUserId) return;
              const { error } = await supabase.from('professional_services').update({ status: 'pending' }).eq('professional_id', sessionUserId).eq('is_active', true);
              if (error) throw error;
              await loadProfessionalServices(sessionUserId);
              alert('Servizi inviati in revisione.');
            }}
            onSaveAvailability={async (days) => {
              if (!sessionUserId) return;
              const rows = days.filter((day) => day.enabled).flatMap((day) => day.slots.map((slot) => ({
                professional_id: sessionUserId,
                weekday: day.weekday,
                start_time: slot.start_time,
                end_time: slot.end_time,
                is_active: true,
              })));
              const { error: deleteError } = await supabase.from('professional_availability').delete().eq('professional_id', sessionUserId);
              if (deleteError) throw deleteError;
              if (rows.length > 0) {
                const { error: insertError } = await supabase.from('professional_availability').insert(rows);
                if (insertError) throw insertError;
              }
              await loadProfessionalAvailability(sessionUserId);
              alert('Disponibilità salvata.');
            }}
            onUploadDocument={async (documentId, file) => {
              handleUploadProfessionalDocument(documentId, file);
            }}
            onRemoveDocument={async (documentId) => {
              handleRemoveProfessionalDocument(documentId);
            }}
            onSubmitDocuments={async () => {
              handleSubmitDocuments();
            }}
            onSubmitOnboarding={async () => {
              if (!sessionUserId) return;
              const nowIso = new Date().toISOString();
              const { error } = await supabase.from('profiles').update({ professional_status: 'submitted', onboarding_completed: false, submitted_at: nowIso, updated_at: nowIso }).eq('id', sessionUserId);
              if (error) throw error;
              setProfessionalStatus('submitted');
              setProfessionalProfileData((prev) => ({ ...prev, professional_status: 'submitted', submitted_at: nowIso }));
              alert('Onboarding inviato. Ora è in revisione admin.');
            }}
            onLogout={handleLogout}
          />
        );
      }
      return renderProfessionalProfile();
    }

    return (
      <ProfilePage
        currentTab={tab}
        onChangeTab={handleTabChange}
        onGoLogin={() => setScreen('login')}
        onGoRegisterCustomer={() => setScreen('registerCustomer')}
        onGoRegisterProfessional={() => setScreen('registerProfessional')}
      />
    );
  };

  if (!authReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#F7F1EE',
          color: '#2B2B2B',
          fontWeight: 700,
        }}
      >
        Caricamento account...
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <LoginPage
        onBack={() => setScreen('tabs')}
        onGoRegisterCustomer={() => setScreen('registerCustomer')}
        onGoRegisterProfessional={() => setScreen('registerProfessional')}
      />
    );
  }

  if (screen === 'registerCustomer') {
    return (
      <RegisterCustomerPage
        onBack={() => setScreen('tabs')}
        onOtpRequested={(email) => {
          setOtpEmail(email);
          setScreen('verifyOtp');
        }}
      />
    );
  }

  if (screen === 'registerProfessional') {
    return (
      <RegisterProfessionalPage
        onBack={() => setScreen('tabs')}
        onOtpRequested={(email) => {
          setOtpEmail(email);
          setScreen('verifyOtp');
        }}
      />
    );
  }


  if (screen === 'verifyOtp') {
    return (
      <VerifyOtpPage
        email={otpEmail}
        onBack={() => setScreen('login')}
        onVerified={bootstrapAuth}
      />
    );
  }

  if (screen === 'proOnboarding') {
    return (
      <ProOnboardingPage
        isAuthenticated={userRole !== 'guest'}
        currentUserEmail={professionalProfileData.email}
        onBack={() => setScreen('tabs')}
        onGoLogin={() => setScreen('login')}
        onComplete={handleProfessionalOnboardingComplete}
      />
    );
  }

  if (screen === 'professionalDetail') {
    return (
      <ProfessionalDetailPage
        professionalId={selectedProfessionalId}
        onBack={() => setScreen('tabs')}
      />
    );
  }

  if (screen === 'serviceProfessionals') {
    return (
      <ServiceProfessionalsPage
        selectedServices={selectedServices}
        onBack={() => setScreen('tabs')}
        onOpenProfessional={(id) => {
          setSelectedProfessionalId(id);
          setScreen('professionalDetail');
        }}
        onGoBookings={() => {
          setTab('bookings');
          setScreen('tabs');
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F1EE' }}>
      {tab === 'home' && (
        <HomePage
          onOpenProfessional={(id) => {
            setSelectedProfessionalId(id);
            setScreen('professionalDetail');
          }}
          onOpenService={(serviceName) => {
            setSelectedServices([serviceName]);
            setScreen('serviceProfessionals');
          }}
          onOpenMacroCategory={(macroCategory) => {
            setBookingsInitialMacro(macroCategory);
            setTab('bookings');
            setScreen('tabs');
          }}
          onGoDiscover={() => setTab('discover')}
          onGoBookings={() => {
            setBookingsInitialMacro('Tutte');
            setTab('bookings');
            setScreen('tabs');
          }}
        />
      )}

      {tab === 'discover' && (
        <DiscoverPage
          onOpenProfessional={(id) => {
            setSelectedProfessionalId(id);
            setScreen('professionalDetail');
          }}
        />
      )}

      {tab === 'bookings' && (
        <BookingsPage
          initialMacroCategory={bookingsInitialMacro}
          onResetInitialMacro={() => setBookingsInitialMacro('Tutte')}
          onSearchProfessionals={(services) => {
            setSelectedServices(services);
            setScreen('serviceProfessionals');
          }}
        />
      )}

      {tab === 'profile' && renderProfileTab()}

      {screen === 'tabs' && tab !== 'profile' && <BottomNav current={tab} onChange={handleTabChange} />}
    </div>
  );
}
