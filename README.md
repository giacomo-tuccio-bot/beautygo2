import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterCustomerPage from './pages/RegisterCustomerPage';
import ProOnboardingPage from './pages/ProOnboardingPage';
import AdminPage from './pages/AdminPage';
import ProfessionalDetailPage from './pages/ProfessionalDetailPage';
import ServiceProfessionalsPage from './pages/ServiceProfessionalsPage';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import { supabase } from './lib/supabase';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';
type UserRole = 'guest' | 'customer' | 'professional' | 'admin';

type Screen =
  | 'tabs'
  | 'login'
  | 'registerCustomer'
  | 'proOnboarding'
  | 'admin'
  | 'professionalDetail'
  | 'serviceProfessionals'
  | 'professionalProfile';

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

export type DocumentStatus = 'missing' | 'draft' | 'pending' | 'approved' | 'rejected';

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
  name: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
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

export type AvailabilityDay = {
  key: AvailabilityDayKey;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
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
};

type PersistedAppState = {
  userRole: UserRole;
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
  screen: Screen;
};

const STORAGE_KEY = 'beautygo-professional-workflow-v8';

const defaultAvailability: AvailabilityDay[] = [
  { key: 'monday', label: 'Lunedì', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'tuesday', label: 'Martedì', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'wednesday', label: 'Mercoledì', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'thursday', label: 'Giovedì', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'friday', label: 'Venerdì', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'saturday', label: 'Sabato', enabled: false, startTime: '09:00', endTime: '18:00' },
  { key: 'sunday', label: 'Domenica', enabled: false, startTime: '09:00', endTime: '18:00' },
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

const getInitialPersistedState = (): PersistedAppState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAppState;

    return {
      ...parsed,
      userRole: parsed.userRole ?? 'guest',
      professionalProfileData: {
        ...emptyProfessionalProfileData,
        ...parsed.professionalProfileData,
      },
      fiscalEditUnlocked: Boolean(parsed.fiscalEditUnlocked),
      fiscalChangeRequested: Boolean(parsed.fiscalChangeRequested),
      professionalDocuments: Array.isArray(parsed.professionalDocuments)
        ? parsed.professionalDocuments.map((doc) => ({
            ...doc,
            downloadUrl: undefined,
          }))
        : [],
      adminRequests: Array.isArray(parsed.adminRequests) ? parsed.adminRequests : [],
      professionalServices: Array.isArray(parsed.professionalServices)
        ? parsed.professionalServices
        : [],
      professionalServicePrices: Array.isArray(parsed.professionalServicePrices)
        ? parsed.professionalServicePrices
        : [],
      professionalAvailability:
        Array.isArray(parsed.professionalAvailability) && parsed.professionalAvailability.length > 0
          ? parsed.professionalAvailability
          : defaultAvailability,
      professionalRequests:
        Array.isArray(parsed.professionalRequests) && parsed.professionalRequests.length > 0
          ? parsed.professionalRequests
          : defaultRequests,
      professionalContract: parsed.professionalContract ?? {
        contractType: 'vat',
        status: 'locked',
      },
      professionalProfileSection: parsed.professionalProfileSection ?? 'overview',
      screen: parsed.screen ?? 'tabs',
    };
  } catch {
    return null;
  }
};

export default function App() {
  const initialPersistedState = getInitialPersistedState();

  const [tab, setTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<Screen>(initialPersistedState?.screen ?? 'tabs');
  const [userRole, setUserRole] = useState<UserRole>(initialPersistedState?.userRole ?? 'guest');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingsInitialMacro, setBookingsInitialMacro] = useState('Tutte');
  const [professionalProfileSection, setProfessionalProfileSection] =
    useState<ProfessionalProfileSection>(
      initialPersistedState?.professionalProfileSection ?? 'overview'
    );

  const [professionalProfileData, setProfessionalProfileData] = useState<ProfessionalProfileData>(
    initialPersistedState?.professionalProfileData ?? emptyProfessionalProfileData
  );

  const [professionalCreatedAt, setProfessionalCreatedAt] = useState<string>(
    initialPersistedState?.professionalCreatedAt ?? ''
  );

  const [professionalProfileImageUrl, setProfessionalProfileImageUrl] = useState<
    string | undefined
  >(initialPersistedState?.professionalProfileImageUrl);

  const [fiscalEditUnlocked, setFiscalEditUnlocked] = useState<boolean>(
    initialPersistedState?.fiscalEditUnlocked ?? false
  );

  const [fiscalChangeRequested, setFiscalChangeRequested] = useState<boolean>(
    initialPersistedState?.fiscalChangeRequested ?? false
  );

  const [fiscalChangeRequestedAt, setFiscalChangeRequestedAt] = useState<string | undefined>(
    initialPersistedState?.fiscalChangeRequestedAt
  );

  const [fiscalChangeRequestNote, setFiscalChangeRequestNote] = useState<string | undefined>(
    initialPersistedState?.fiscalChangeRequestNote
  );

  const [adminRequests, setAdminRequests] = useState<ProfessionalAdminRequest[]>(
    initialPersistedState?.adminRequests ?? []
  );

  const [professionalServices, setProfessionalServices] = useState<ProfessionalServiceItem[]>(
    initialPersistedState?.professionalServices ?? []
  );
  const [professionalDocuments, setProfessionalDocuments] = useState<ProfessionalDocument[]>(
    initialPersistedState?.professionalDocuments ?? []
  );
  const [professionalServicePrices, setProfessionalServicePrices] = useState<
    ProfessionalServicePrice[]
  >(initialPersistedState?.professionalServicePrices ?? []);
  const [professionalAvailability, setProfessionalAvailability] = useState<AvailabilityDay[]>(
    initialPersistedState?.professionalAvailability ?? defaultAvailability
  );
  const [availabilitySaved, setAvailabilitySaved] = useState(
    initialPersistedState?.availabilitySaved ?? false
  );
  const [professionalRequests, setProfessionalRequests] = useState<ProfessionalRequest[]>(
    initialPersistedState?.professionalRequests ?? defaultRequests
  );

  const [professionalContract, setProfessionalContract] = useState<ProfessionalContract>(
    initialPersistedState?.professionalContract ?? {
      contractType: 'vat',
      status: 'locked',
    }
  );

  const documentsRef = useRef<ProfessionalDocument[]>(professionalDocuments);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stateToPersist: PersistedAppState = {
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
      professionalDocuments: professionalDocuments.map(({ downloadUrl, ...doc }) => doc),
      professionalServicePrices,
      professionalAvailability,
      availabilitySaved,
      professionalRequests,
      professionalContract,
      professionalProfileSection,
      screen,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [
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
    screen,
  ]);

  const createDefaultDocuments = (tipoDocumentoFiscale: string): ProfessionalDocument[] => {
    const fiscalDocumentName =
      tipoDocumentoFiscale === 'piva'
        ? 'Documento Partita IVA'
        : 'Codice Fiscale / Tessera sanitaria';

    return [
      { id: 'identity-document', name: 'Documento di identità', status: 'missing' },
      { id: 'tax-document', name: fiscalDocumentName, status: 'missing' },
      { id: 'professional-certificate', name: 'Certificazione professionale', status: 'missing' },
    ];
  };

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
        'Questo file non è disponibile dopo il refresh. Ricaricalo oppure passa a storage reale nel prossimo step.'
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
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setProfessionalAvailability((prev) =>
      prev.map((day) => (day.key === dayKey ? { ...day, [field]: value } : day))
    );
    setAvailabilitySaved(false);
  };

  const handleSaveAvailability = () => {
    const activeDays = professionalAvailability.filter((day) => day.enabled);

    if (activeDays.length === 0) {
      alert('Seleziona almeno un giorno lavorativo.');
      return;
    }

    const hasInvalidTimeRange = activeDays.some((day) => day.startTime >= day.endTime);

    if (hasInvalidTimeRange) {
      alert("Controlla gli orari: l'orario di fine deve essere successivo a quello di inizio.");
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

  const handleSupabaseLogout = async () => {
    await supabase.auth.signOut();
    setUserRole('guest');
    setProfessionalCreatedAt('');
    setProfessionalProfileSection('overview');
    setScreen('tabs');
    setTab('profile');
  };

  if (screen === 'login') {
    return (
      <LoginPage
        onBack={() => setScreen('tabs')}
        onAdminLogin={() => {
          setUserRole('admin');
          setScreen('admin');
        }}
        onProfessionalLogin={() => {
          const hasProfessionalProfile =
            !!professionalProfileData.nome &&
            !!professionalProfileData.cognome &&
            !!professionalProfileData.email;

          if (!hasProfessionalProfile) {
            alert('Prima completa la registrazione professionista.');
            setScreen('proOnboarding');
            return;
          }

          if (!professionalCreatedAt) {
            setProfessionalCreatedAt(new Date().toISOString());
          }

          setUserRole('professional');
          setScreen('tabs');
          setTab('profile');
        }}
        onCustomerLogin={() => {
          setUserRole('customer');
          setScreen('tabs');
          setTab('profile');
        }}
      />
    );
  }

  if (screen === 'registerCustomer') {
    return <RegisterCustomerPage onBack={() => setScreen('tabs')} />;
  }

  if (screen === 'proOnboarding') {
    return (
      <ProOnboardingPage
        onBack={() => setScreen('tabs')}
        onComplete={async (data) => {
          const nowIso = new Date().toISOString();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            alert('Utente non autenticato. Fai di nuovo login.');
            setScreen('login');
            return;
          }

          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ role: 'professional', email: data.email })
            .eq('id', user.id);

          if (profileUpdateError) {
            alert(profileUpdateError.message);
            return;
          }

          setProfessionalProfileData({
            nome: data.nome,
            cognome: data.cognome,
            email: data.email,
            telefono: data.telefono,
            citta: data.citta,
            indirizzo: data.indirizzo,
            tipoDocumentoFiscale: data.tipoDocumentoFiscale,
            valoreDocumentoFiscale: data.valoreDocumentoFiscale,
            intestatarioFatturazione: data.intestatarioFatturazione,
            ragioneSociale: data.ragioneSociale,
            codiceFiscaleFatturazione: data.codiceFiscaleFatturazione,
            partitaIvaFatturazione: data.partitaIvaFatturazione,
            indirizzoFatturazione: data.indirizzoFatturazione,
            cittaFatturazione: data.cittaFatturazione,
            capFatturazione: data.capFatturazione,
            provinciaFatturazione: data.provinciaFatturazione,
            pec: data.pec,
            codiceDestinatario: data.codiceDestinatario,
          });
          setProfessionalCreatedAt(nowIso);
          setUserRole('professional');
          setProfessionalProfileImageUrl(undefined);
          setFiscalEditUnlocked(false);
          setFiscalChangeRequested(false);
          setFiscalChangeRequestedAt(undefined);
          setFiscalChangeRequestNote(undefined);
          setAdminRequests([
            {
              id: 'professional-1',
              createdAt: nowIso,
            },
          ]);
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
          setScreen('professionalProfile');
        }}
      />
    );
  }

  if (screen === 'professionalProfile') {
    return (
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
        onLogout={handleSupabaseLogout}
        onRequestFiscalChange={(note) => {
          setFiscalChangeRequested(true);
          setFiscalChangeRequestedAt(new Date().toISOString());
          setFiscalChangeRequestNote(note || '');
          alert('Richiesta inviata correttamente all’amministrazione.');
        }}
        onUploadProfessionalProfileImage={handleUploadProfessionalProfileImage}
        onRemoveProfessionalProfileImage={handleRemoveProfessionalProfileImage}
        onSaveProfileData={(data) => {
          setProfessionalProfileData(data);

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

            let updated: ProfessionalServiceItem[];

            if (existing) {
              updated = prev.filter((service) => service.name !== serviceName);
            } else {
              updated = [
                ...prev,
                {
                  id: createServiceId(serviceName),
                  name: serviceName,
                  status: 'draft',
                },
              ];
            }

            setProfessionalServicePrices((currentPrices) =>
              currentPrices.filter((item) =>
                updated.some((service) => service.name === item.service)
              )
            );

            return updated;
          });
        }}
        onSubmitServices={() => {
          const hasServices = professionalServices.length > 0;

          if (!hasServices) {
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
            const withoutCurrent = prev.filter((item) => item.id !== 'professional-1');
            return [{ id: 'professional-1', createdAt: nowIso }, ...withoutCurrent];
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
  }

  if (screen === 'admin') {
    if (userRole !== 'admin') {
      return (
        <LoginPage
          onBack={() => setScreen('tabs')}
          onAdminLogin={() => {
            setUserRole('admin');
            setScreen('admin');
          }}
          onProfessionalLogin={() => {
            const hasProfessionalProfile =
              !!professionalProfileData.nome &&
              !!professionalProfileData.cognome &&
              !!professionalProfileData.email;

            if (!hasProfessionalProfile) {
              alert('Prima completa la registrazione professionista.');
              setScreen('proOnboarding');
              return;
            }

            if (!professionalCreatedAt) {
              setProfessionalCreatedAt(new Date().toISOString());
            }

            setUserRole('professional');
            setScreen('tabs');
            setTab('profile');
          }}
          onCustomerLogin={() => {
            setUserRole('customer');
            setScreen('tabs');
            setTab('profile');
          }}
        />
      );
    }

    return (
      <AdminPage
        currentTab={tab}
        onChangeTab={handleTabChange}
        professionalData={professionalProfileData}
        professionalCreatedAt={professionalCreatedAt}
        adminRequests={adminRequests}
        professionalServices={professionalServices}
        documents={professionalDocuments}
        contract={professionalContract}
        availabilitySaved={availabilitySaved}
        isProfileActive={isProfileActive}
        fiscalEditUnlocked={fiscalEditUnlocked}
        fiscalChangeRequested={fiscalChangeRequested}
        fiscalChangeRequestedAt={fiscalChangeRequestedAt}
        fiscalChangeRequestNote={fiscalChangeRequestNote}
        onApproveService={handleAdminApproveService}
        onRejectService={handleAdminRejectService}
        onApproveDocument={handleAdminApproveDocument}
        onRejectDocument={handleAdminRejectDocument}
        onDownloadDocument={handleDownloadProfessionalDocument}
        onUploadContract={handleAdminUploadContract}
        onMakeContractReady={handleAdminMakeContractReady}
        onUnlockFiscalEdit={handleAdminUnlockFiscalEdit}
        onLockFiscalEdit={handleAdminLockFiscalEdit}
        onLogout={() => {
          setUserRole('guest');
          setScreen('tabs');
          setTab('profile');
        }}
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
          onSearchProfessionals={(services) => {
            setSelectedServices(services);
            setScreen('serviceProfessionals');
          }}
        />
      )}

      {tab === 'profile' &&
        (userRole === 'admin' ? (
          <AdminPage
            currentTab={tab}
            onChangeTab={handleTabChange}
            professionalData={professionalProfileData}
            professionalCreatedAt={professionalCreatedAt}
            adminRequests={adminRequests}
            professionalServices={professionalServices}
            documents={professionalDocuments}
            contract={professionalContract}
            availabilitySaved={availabilitySaved}
            isProfileActive={isProfileActive}
            fiscalEditUnlocked={fiscalEditUnlocked}
            fiscalChangeRequested={fiscalChangeRequested}
            fiscalChangeRequestedAt={fiscalChangeRequestedAt}
            fiscalChangeRequestNote={fiscalChangeRequestNote}
            onApproveService={handleAdminApproveService}
            onRejectService={handleAdminRejectService}
            onApproveDocument={handleAdminApproveDocument}
            onRejectDocument={handleAdminRejectDocument}
            onDownloadDocument={handleDownloadProfessionalDocument}
            onUploadContract={handleAdminUploadContract}
            onMakeContractReady={handleAdminMakeContractReady}
            onUnlockFiscalEdit={handleAdminUnlockFiscalEdit}
            onLockFiscalEdit={handleAdminLockFiscalEdit}
            onLogout={() => {
              setUserRole('guest');
              setScreen('tabs');
              setTab('profile');
            }}
          />
        ) : userRole === 'customer' ? (
          <CustomerProfilePage
            currentTab={tab}
            onChangeTab={handleTabChange}
            onLogout={handleSupabaseLogout}
          />
        ) : userRole === 'professional' ? (
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
            onLogout={handleSupabaseLogout}
            onRequestFiscalChange={(note) => {
              setFiscalChangeRequested(true);
              setFiscalChangeRequestedAt(new Date().toISOString());
              setFiscalChangeRequestNote(note || '');
              alert('Richiesta inviata correttamente all’amministrazione.');
            }}
            onUploadProfessionalProfileImage={handleUploadProfessionalProfileImage}
            onRemoveProfessionalProfileImage={handleRemoveProfessionalProfileImage}
            onSaveProfileData={(data) => {
              setProfessionalProfileData(data);

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

                let updated: ProfessionalServiceItem[];

                if (existing) {
                  updated = prev.filter((service) => service.name !== serviceName);
                } else {
                  updated = [
                    ...prev,
                    {
                      id: createServiceId(serviceName),
                      name: serviceName,
                      status: 'draft',
                    },
                  ];
                }

                setProfessionalServicePrices((currentPrices) =>
                  currentPrices.filter((item) =>
                    updated.some((service) => service.name === item.service)
                  )
                );

                return updated;
              });
            }}
            onSubmitServices={() => {
              const hasServices = professionalServices.length > 0;

              if (!hasServices) {
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
                const withoutCurrent = prev.filter((item) => item.id !== 'professional-1');
                return [{ id: 'professional-1', createdAt: nowIso }, ...withoutCurrent];
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
        ) : (
          <ProfilePage
            onGoLogin={() => setScreen('login')}
            onGoRegisterCustomer={() => setScreen('registerCustomer')}
            onGoProOnboarding={() => setScreen('proOnboarding')}
          />
        ))}

      <BottomNav current={tab} onChange={handleTabChange} />
    </div>
  );
}