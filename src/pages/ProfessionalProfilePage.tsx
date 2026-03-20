import React, { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import ProfessionalAvailabilityPage from './ProfessionalAvailabilityPage';
import ProfessionalRequestsPage from './ProfessionalRequestsPage';
import ProfessionalCalendarPage from './ProfessionalCalendarPage';
import ProfessionalContractsPage from './ProfessionalContractsPage';
import { colors } from '../theme';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

type ProfessionalProfileSection =
  | 'overview'
  | 'services'
  | 'pricing'
  | 'documents'
  | 'availability'
  | 'calendar'
  | 'requests'
  | 'info'
  | 'contracts';

type DocumentStatus = 'missing' | 'draft' | 'pending' | 'approved' | 'rejected';

type ProfessionalDocument = {
  id: string;
  name: string;
  fileName?: string;
  uploadedAt?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  downloadUrl?: string;
};

type ProfessionalServiceItem = {
  id: string;
  name: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

type ProfessionalServicePrice = {
  service: string;
  price: string;
};

type AvailabilityDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type AvailabilityDay = {
  key: AvailabilityDayKey;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

type ProfessionalRequest = {
  id: string;
  customerName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  minutesLeft: number;
  status: RequestStatus;
};

type ContractStatus =
  | 'locked'
  | 'uploaded_by_admin'
  | 'ready_for_signature'
  | 'signed';

type ProfessionalContract = {
  contractType: 'vat' | 'tax_code';
  status: ContractStatus;
  fileName?: string;
  uploadedAt?: string;
  availableAt?: string;
  signedAt?: string;
};

type ProfessionalProfileData = {
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

const serviceSections = [
  {
    title: 'Capelli Donna',
    services: [
      'Piega',
      'Piega con ferro',
      'Piega extension',
      'Piastra / styling veloce',
      'Taglio donna',
      'Taglio frangia',
      'Colore in olio',
      'Tonalizzante / riflessante',
      'Gloss',
      'Maschera colorante',
      'Schiaritura smart',
      'Balayage soft',
      'Pulizia colore cosmetico',
      'Raccolto',
      'Semiraccolto',
      'Trecce + piega',
      'Trecce + asciugatura',
      'Capelli sposa',
    ],
  },
  {
    title: 'Capelli Uomo',
    services: [
      'Taglio uomo',
      'Taglio razor',
      'Rifinitura barba',
      'Rasatura',
      'Trattamento barba',
    ],
  },
  {
    title: 'Epilazione Donna',
    services: [
      'Gamba intera',
      'Mezza gamba',
      'Inguine',
      'Braccia',
      'Ascelle',
      'Viso (baffetti / sopracciglia / completo)',
      'Glutei',
      'Cera completa',
    ],
  },
  {
    title: 'Epilazione Uomo',
    services: [
      'Schiena',
      'Petto',
      'Addome',
      'Petto + addome',
      'Gamba intera',
      'Braccia',
      'Ascelle',
      'Spalle',
      'Glutei',
    ],
  },
  {
    title: 'Mani',
    services: [
      'Manicure base',
      'Manicure french',
      'Semipermanente',
      'Rimozione semipermanente',
      'Copertura gel',
      'Ricostruzione unghie',
      'Nail art',
    ],
  },
  {
    title: 'Piedi',
    services: ['Pedicure completo', 'Pedicure + semipermanente'],
  },
  {
    title: 'Viso',
    services: [
      'Trattamento viso base',
      'Trattamento idratante / anti-age',
      'Trucco giorno',
      'Trucco sera',
    ],
  },
];

function getInitials(nome?: string, cognome?: string) {
  const first = nome?.trim()?.[0] || '';
  const second = cognome?.trim()?.[0] || '';
  const value = `${first}${second}`.toUpperCase();
  return value || 'PR';
}

export default function ProfessionalProfilePage({
  profileData,
  activeSection,
  professionalServices,
  professionalDocuments,
  professionalServicePrices,
  professionalAvailability,
  availabilitySaved,
  professionalRequests,
  professionalContract,
  contractsUnlocked,
  isProfileActive,
  professionalProfileImageUrl,
  fiscalEditUnlocked,
  fiscalChangeRequested,
  fiscalChangeRequestedAt,
  fiscalChangeRequestNote,
  onUploadProfessionalProfileImage,
  onRemoveProfessionalProfileImage,
  onSaveProfileData,
  onRequestFiscalChange,
  onBack: _onBack,
  onOpenSection,
  onToggleService,
  onSubmitServices,
  onUploadProfessionalDocument,
  onRemoveProfessionalDocument,
  onDownloadProfessionalDocument,
  onSubmitDocuments,
  onPriceChange,
  onSavePrices,
  onToggleAvailabilityDay,
  onAvailabilityTimeChange,
  onSaveAvailability,
  onAcceptRequest,
  onRejectRequest,
  onSendContractOtp,
  onMarkContractSigned,
  currentTab,
  onChangeTab,
  onLogout,
}: {
  profileData: ProfessionalProfileData;
  activeSection: ProfessionalProfileSection;
  professionalServices: ProfessionalServiceItem[];
  professionalDocuments: ProfessionalDocument[];
  professionalServicePrices: ProfessionalServicePrice[];
  professionalAvailability: AvailabilityDay[];
  availabilitySaved: boolean;
  professionalRequests: ProfessionalRequest[];
  professionalContract: ProfessionalContract;
  contractsUnlocked: boolean;
  isProfileActive: boolean;
  professionalProfileImageUrl?: string;
  fiscalEditUnlocked: boolean;
  fiscalChangeRequested: boolean;
  fiscalChangeRequestedAt?: string;
  fiscalChangeRequestNote?: string;
  onUploadProfessionalProfileImage: (file: File) => void;
  onRemoveProfessionalProfileImage: () => void;
  onSaveProfileData: (data: ProfessionalProfileData) => void;
  onRequestFiscalChange: (note?: string) => void;
  onBack: () => void;
  onOpenSection: (section: ProfessionalProfileSection) => void;
  onToggleService: (service: string) => void;
  onSubmitServices: () => void;
  onUploadProfessionalDocument: (documentId: string, file: File) => void;
  onRemoveProfessionalDocument: (documentId: string) => void;
  onDownloadProfessionalDocument: (documentId: string) => void;
  onSubmitDocuments: () => void;
  onPriceChange: (service: string, price: string) => void;
  onSavePrices: () => void;
  onToggleAvailabilityDay: (dayKey: AvailabilityDayKey) => void;
  onAvailabilityTimeChange: (
    dayKey: AvailabilityDayKey,
    field: 'startTime' | 'endTime',
    value: string
  ) => void;
  onSaveAvailability: () => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onSendContractOtp: () => void;
  onMarkContractSigned: () => void;
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  onLogout: () => void;
}) {
  const isVat = profileData.tipoDocumentoFiscale === 'piva';
  const profileInitials = getInitials(profileData.nome, profileData.cognome);

  const [profileForm, setProfileForm] = useState<ProfessionalProfileData>(profileData);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fiscalRequestNote, setFiscalRequestNote] = useState('');
  const [showFiscalRequestBox, setShowFiscalRequestBox] = useState(false);

  useEffect(() => {
    setProfileForm(profileData);
  }, [profileData]);

  const handleProfileChange = (key: keyof ProfessionalProfileData, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStartEdit = () => {
    setProfileForm(profileData);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setProfileForm(profileData);
    setIsEditingProfile(false);
  };

  const handleSaveEditableProfile = () => {
    onSaveProfileData(profileForm);
    setIsEditingProfile(false);
    alert('Dati profilo e fatturazione salvati correttamente.');
  };

  const handleSubmitFiscalChangeRequest = () => {
    onRequestFiscalChange(fiscalRequestNote);
    setShowFiscalRequestBox(false);
    setFiscalRequestNote('');
  };

  const uploadedDocumentsCount = professionalDocuments.filter((doc) => !!doc.fileName).length;
  const pendingDocumentsCount = professionalDocuments.filter((doc) => doc.status === 'pending').length;
  const approvedDocumentsCount = professionalDocuments.filter((doc) => doc.status === 'approved').length;
  const enabledAvailabilityDays = professionalAvailability.filter((day) => day.enabled);
  const pendingRequestsCount = professionalRequests.filter((request) => request.status === 'pending').length;
  const acceptedRequestsCount = professionalRequests.filter((request) => request.status === 'accepted').length;

  const selectedServiceNames = professionalServices.map((service) => service.name);
  const submittedServices = professionalServices.filter(
    (service) =>
      service.status === 'pending' ||
      service.status === 'approved' ||
      service.status === 'rejected'
  );
  const approvedServices = professionalServices.filter((service) => service.status === 'approved');
  const pendingServices = professionalServices.filter((service) => service.status === 'pending');
  const rejectedServices = professionalServices.filter((service) => service.status === 'rejected');
  const hasApprovedServices = approvedServices.length > 0;

  const documentsSubtitle =
    approvedDocumentsCount > 0
      ? `${approvedDocumentsCount} approvato/i`
      : pendingDocumentsCount > 0
      ? `${pendingDocumentsCount} in verifica`
      : uploadedDocumentsCount > 0
      ? `${uploadedDocumentsCount} caricato/i`
      : 'Qualifiche e certificazioni';

  const pricingSubtitle = hasApprovedServices
    ? 'Listino attivo'
    : submittedServices.length > 0
    ? 'Sblocco dopo approvazione'
    : 'Attendi invio servizi';

  const availabilitySubtitle = availabilitySaved
    ? `${enabledAvailabilityDays.length} giorno/i attivo/i`
    : enabledAvailabilityDays.length > 0
    ? 'Modifiche non salvate'
    : 'Giorni e fasce lavorative';

  const requestsSubtitle =
    pendingRequestsCount > 0
      ? `${pendingRequestsCount} da gestire`
      : 'Accetta o rifiuta entro 10 min';

  const calendarSubtitle =
    acceptedRequestsCount > 0
      ? `${acceptedRequestsCount} appuntamento/i`
      : 'Agenda personale richieste';

  const contractsSubtitle =
    professionalContract.status === 'signed'
      ? 'Contratto firmato'
      : professionalContract.status === 'ready_for_signature'
      ? 'Pronto alla firma'
      : professionalContract.status === 'uploaded_by_admin'
      ? 'Caricato da admin'
      : 'Dopo verifiche positive';

  const checklist = [
    { label: 'Almeno un servizio approvato', done: hasApprovedServices },
    { label: 'Documenti approvati', done: approvedDocumentsCount >= 3 },
    { label: 'Disponibilità salvata', done: availabilitySaved },
    { label: 'Contratto firmato', done: professionalContract.status === 'signed' },
  ];

  const sectionMeta: Record<
    Exclude<
      ProfessionalProfileSection,
      'overview' | 'services' | 'pricing' | 'documents' | 'availability' | 'requests' | 'calendar' | 'contracts'
    >,
    { title: string; description: string; status: string }
  > = {
    info: {
      title: 'Informativa',
      description:
        'Area dedicata a privacy, condizioni di utilizzo e obblighi professionali.',
      status: 'Da consultare',
    },
  };

  if (activeSection === 'services') {
    return (
      <div style={pageStyle}>
        <h1 style={pageTitle}>Servizi offerti</h1>

        <p style={pageSubtitle}>
          Seleziona i servizi che puoi offrire. Dopo l’invio, ogni servizio entrerà
          in stato di verifica separato e potrà essere approvato o rifiutato singolarmente.
        </p>

        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          <div style={card}>
            <div style={sectionTitle}>Stato servizi inviati</div>

            {submittedServices.length > 0 ? (
              <>
                {approvedServices.length > 0 && (
                  <div style={successBox}>
                    {approvedServices.length} servizio/i approvato/i
                  </div>
                )}

                {pendingServices.length > 0 && (
                  <div style={{ ...statusBox, marginTop: approvedServices.length > 0 ? 10 : 0 }}>
                    {pendingServices.length} servizio/i in verifica
                  </div>
                )}

                {rejectedServices.length > 0 && (
                  <div style={{ ...rejectedBox, marginTop: 10 }}>
                    {rejectedServices.length} servizio/i rifiutato/i
                  </div>
                )}

                <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                  {professionalServices.map((service) => (
                    <div key={service.id} style={serviceStatusCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <div style={chipWarning}>{service.name}</div>
                        <div style={getServiceStatusBadgeStyle(service.status)}>
                          {getServiceStatusLabel(service.status)}
                        </div>
                      </div>

                      {service.rejectionReason && (
                        <div style={rejectionText}>Motivo rifiuto: {service.rejectionReason}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={mutedText}>Nessun servizio ancora inviato per verifica.</div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Seleziona i servizi</div>

            <div style={noteBox}>
              I servizi selezionati non verranno pubblicati automaticamente. Saranno
              soggetti a verifica tecnica e professionale.
            </div>

            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
              {serviceSections.map((section) => (
                <div key={section.title}>
                  <div style={pill}>{section.title}</div>
                  <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                    {section.services.map((service) => {
                      const currentService = professionalServices.find((item) => item.name === service);
                      const active = !!currentService;

                      return (
                        <button
                          key={service}
                          onClick={() => onToggleService(service)}
                          style={{
                            border: 'none',
                            background: active
                              ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                              : '#FFF3E8',
                            color: active ? '#fff' : colors.text,
                            borderRadius: 16,
                            padding: '14px 14px',
                            fontWeight: 700,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          {active ? '✓ ' : ''}
                          {service}
                          {currentService && (
                            <span style={{ marginLeft: 8, opacity: 0.9 }}>
                              · {getServiceStatusLabel(currentService.status)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onSubmitServices}
              disabled={selectedServiceNames.length === 0}
              style={{
                ...primaryFullButton,
                background:
                  selectedServiceNames.length > 0
                    ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                    : '#E5E5E5',
                color: selectedServiceNames.length > 0 ? '#fff' : '#9A9A9A',
                cursor: selectedServiceNames.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Invia servizi per verifica
            </button>
          </div>
        </div>

        <BottomSingleButton label="← Torna alla dashboard" onClick={() => onOpenSection('overview')} />
      </div>
    );
  }

  if (activeSection === 'pricing') {
    const canEditPrices = hasApprovedServices;
    const priceServices = approvedServices.map((service) => service.name);

    return (
      <div style={pageStyle}>
        <h1 style={pageTitle}>Prezzi servizi</h1>

        <p style={pageSubtitle}>
          Il listino può essere configurato solo per i servizi approvati.
        </p>

        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          <div style={card}>
            <div style={sectionTitle}>Stato listino</div>

            {hasApprovedServices ? (
              <div style={successBox}>Prezzi sbloccati: puoi compilare il listino</div>
            ) : submittedServices.length > 0 ? (
              <div style={statusBox}>Prezzi bloccati fino ad approvazione servizi</div>
            ) : (
              <div style={mutedText}>
                Seleziona e invia prima i servizi offerti per poter configurare i prezzi.
              </div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Listino professionista</div>

            {priceServices.length === 0 ? (
              <div style={mutedText}>
                Nessun servizio approvato disponibile. Vai nella sezione “Servizi offerti”.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {priceServices.map((service) => {
                  const currentValue =
                    professionalServicePrices.find((item) => item.service === service)?.price || '';

                  return (
                    <div key={service} style={priceRowCard}>
                      <div style={{ marginBottom: 10 }}>
                        <div style={documentTitle}>{service}</div>
                        <div style={smallMutedText}>
                          Inserisci il prezzo da pubblicare dopo approvazione.
                        </div>
                      </div>

                      <div style={priceInputWrap}>
                        <span style={currencyLabel}>€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.50"
                          value={currentValue}
                          disabled={!canEditPrices}
                          onChange={(e) => onPriceChange(service, e.target.value)}
                          placeholder="0.00"
                          style={{
                            ...priceInput,
                            opacity: canEditPrices ? 1 : 0.65,
                            cursor: canEditPrices ? 'text' : 'not-allowed',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={onSavePrices}
              disabled={!canEditPrices || priceServices.length === 0}
              style={{
                ...primaryFullButton,
                background:
                  canEditPrices && priceServices.length > 0
                    ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                    : '#E5E5E5',
                color: canEditPrices && priceServices.length > 0 ? '#fff' : '#9A9A9A',
                cursor:
                  canEditPrices && priceServices.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Salva listino
            </button>
          </div>
        </div>

        <BottomSingleButton label="← Torna alla dashboard" onClick={() => onOpenSection('overview')} />
      </div>
    );
  }

  if (activeSection === 'documents') {
    const canSubmitDocuments = uploadedDocumentsCount > 0;

    return (
      <div style={pageStyle}>
        <h1 style={pageTitle}>Documenti e certificazioni</h1>

        <p style={pageSubtitle}>
          Carica i documenti richiesti per completare la verifica del profilo professionista.
        </p>

        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          <div style={card}>
            <div style={sectionTitle}>Stato documentazione</div>

            {professionalDocuments.some((doc) => doc.status === 'approved') ? (
              <div style={successBox}>Documenti approvati</div>
            ) : professionalDocuments.some((doc) => doc.status === 'pending') ? (
              <div style={statusBox}>Documenti inviati per verifica</div>
            ) : (
              <div style={mutedText}>
                Carica i documenti richiesti e inviali per verifica.
              </div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Documenti richiesti</div>

            <div style={noteBox}>
              I documenti caricati verranno verificati prima dell’abilitazione completa del profilo.
            </div>

            <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              {professionalDocuments.map((doc) => (
                <div key={doc.id} style={documentCard}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={documentTitle}>{doc.name}</div>
                        <div style={getStatusBadgeStyle(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </div>
                      </div>

                      {doc.fileName ? (
                        <div style={{ marginTop: 10 }}>
                          <div style={documentInfoRow}>
                            <strong>File caricato:</strong> {doc.fileName}
                          </div>

                          {doc.uploadedAt && (
                            <div style={documentInfoRow}>
                              <strong>Caricato il:</strong>{' '}
                              {new Date(doc.uploadedAt).toLocaleString('it-IT')}
                            </div>
                          )}

                          <div style={documentInfoRow}>
                            <strong>Download disponibile:</strong>{' '}
                            {doc.downloadUrl ? 'Sì' : 'No'}
                          </div>
                        </div>
                      ) : (
                        <div style={{ ...mutedText, marginTop: 10 }}>
                          Nessun file caricato.
                        </div>
                      )}

                      {doc.rejectionReason && (
                        <div style={rejectionText}>
                          Motivo rifiuto: {doc.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <label style={uploadButton}>
                        Carica file
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            onUploadProfessionalDocument(doc.id, file);
                            e.currentTarget.value = '';
                          }}
                        />
                      </label>

                      {doc.fileName && doc.downloadUrl && (
                        <button
                          onClick={() => onDownloadProfessionalDocument(doc.id)}
                          style={secondaryButton}
                        >
                          Scarica file
                        </button>
                      )}

                      {doc.fileName && doc.status !== 'pending' && doc.status !== 'approved' && (
                        <button onClick={() => onRemoveProfessionalDocument(doc.id)} style={secondaryButton}>
                          Rimuovi
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onSubmitDocuments}
              disabled={!canSubmitDocuments}
              style={{
                ...primaryFullButton,
                background: canSubmitDocuments
                  ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                  : '#E5E5E5',
                color: canSubmitDocuments ? '#fff' : '#9A9A9A',
                cursor: canSubmitDocuments ? 'pointer' : 'not-allowed',
              }}
            >
              Invia documenti per verifica
            </button>
          </div>
        </div>

        <BottomSingleButton label="← Torna alla dashboard" onClick={() => onOpenSection('overview')} />
      </div>
    );
  }

  if (activeSection === 'availability') {
    return (
      <ProfessionalAvailabilityPage
        professionalAvailability={professionalAvailability}
        availabilitySaved={availabilitySaved}
        onToggleAvailabilityDay={onToggleAvailabilityDay}
        onAvailabilityTimeChange={onAvailabilityTimeChange}
        onSaveAvailability={onSaveAvailability}
        onBack={() => onOpenSection('overview')}
      />
    );
  }

  if (activeSection === 'requests') {
    return (
      <ProfessionalRequestsPage
        requests={professionalRequests}
        onAcceptRequest={onAcceptRequest}
        onRejectRequest={onRejectRequest}
        onBack={() => onOpenSection('overview')}
      />
    );
  }

  if (activeSection === 'calendar') {
    return (
      <ProfessionalCalendarPage
        professionalAvailability={professionalAvailability}
        requests={professionalRequests}
        onBack={() => onOpenSection('overview')}
      />
    );
  }

  if (activeSection === 'contracts') {
    return (
      <ProfessionalContractsPage
        professionalContract={professionalContract}
        contractsUnlocked={contractsUnlocked}
        onSendOtp={onSendContractOtp}
        onMarkSigned={onMarkContractSigned}
        onBack={() => onOpenSection('overview')}
      />
    );
  }

  if (activeSection !== 'overview') {
    const meta =
      sectionMeta[
        activeSection as Exclude<
          ProfessionalProfileSection,
          'overview' | 'services' | 'pricing' | 'documents' | 'availability' | 'requests' | 'calendar' | 'contracts'
        >
      ];

    return (
      <div style={pageStyle}>
        <h1 style={pageTitle}>{meta.title}</h1>
        <p style={pageSubtitle}>{meta.description}</p>

        <div style={{ marginTop: 18, background: '#fff', borderRadius: 24, padding: 18, boxShadow: colors.shadow }}>
          <div style={metaStatus}>{meta.status}</div>
          <div style={{ color: colors.muted, fontSize: 14, lineHeight: 1.7 }}>
            Questa sezione sarà resa operativa nel prossimo step.
          </div>
        </div>

        <BottomSingleButton label="← Torna alla dashboard" onClick={() => onOpenSection('overview')} />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          gap: 12,
        }}
      >
        <h1 style={{ ...pageTitle, textAlign: 'left', marginBottom: 0 }}>
          Dashboard Professionista
        </h1>

        <button
          onClick={onLogout}
          style={{
            border: 'none',
            borderRadius: 12,
            padding: '10px 14px',
            background: '#FFEAEA',
            color: '#C53B3B',
            fontWeight: 800,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Esci
        </button>
      </div>

      <p style={pageSubtitle}>
        Completa il profilo, configura i dati professionali e gestisci l’operatività
        direttamente da questa area.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        <div style={card}>
          <div style={sectionTitle}>Profilo pubblico</div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {professionalProfileImageUrl ? (
              <img
                src={professionalProfileImageUrl}
                alt="Foto profilo professionista"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 28,
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                  background: '#fff',
                }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 28,
                  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  fontWeight: 800,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                }}
              >
                {profileInitials}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ color: colors.text, fontSize: 18, fontWeight: 800 }}>
                {profileData.nome} {profileData.cognome}
              </div>
              <div style={{ color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
                Questa immagine sarà quella associata al profilo del professionista e potrà
                essere mostrata anche nelle schede pubbliche e nelle liste.
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <label style={uploadButton}>
                  Carica foto profilo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      onUploadProfessionalProfileImage(file);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>

                {professionalProfileImageUrl && (
                  <button
                    onClick={onRemoveProfessionalProfileImage}
                    style={secondaryButton}
                  >
                    Rimuovi foto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>Stato account</div>

          <div
            style={{
              padding: 14,
              borderRadius: 18,
              background: isProfileActive ? '#EAF8EF' : '#FFF8F1',
              border: isProfileActive ? '1px solid #D9EFDF' : '1px solid #F6E5D7',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: isProfileActive ? '#228B4E' : '#FF6A00',
                marginBottom: 6,
              }}
            >
              {isProfileActive ? 'Profilo attivo' : 'Profilo creato - attivazione non completata'}
            </div>

            <div style={mutedText}>
              {isProfileActive
                ? 'Il professionista ha completato tutte le fasi richieste ed è pronto per essere operativo.'
                : 'Per attivare il profilo servono almeno un servizio approvato, documenti approvati, disponibilità salvata e contratto firmato.'}
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>Checklist attivazione</div>

          <div style={{ display: 'grid', gap: 10 }}>
            {checklist.map((item) => (
              <div key={item.label} style={checkRow}>
                <div style={{ color: colors.text, fontWeight: 700 }}>
                  {item.done ? '✓' : '•'} {item.label}
                </div>
                <div style={item.done ? donePill : pendingPill}>
                  {item.done ? 'Completato' : 'Da completare'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            <div style={sectionTitle}>Profilo professionista</div>

            {!isEditingProfile ? (
              <button onClick={handleStartEdit} style={secondaryButton}>
                Modifica profilo
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={handleCancelEdit} style={secondaryButton}>
                  Annulla
                </button>
                <button onClick={handleSaveEditableProfile} style={saveInlineButton}>
                  Salva modifiche
                </button>
              </div>
            )}
          </div>

          {!isEditingProfile ? (
            <>
              <div style={viewSectionTitle}>Dati anagrafici e contatti</div>
              <div style={row}><strong>Nome:</strong> {profileData.nome}</div>
              <div style={row}><strong>Cognome:</strong> {profileData.cognome}</div>
              <div style={row}><strong>Email:</strong> {profileData.email}</div>
              <div style={row}><strong>Telefono:</strong> {profileData.telefono}</div>
              <div style={row}><strong>Città:</strong> {profileData.citta}</div>
              <div style={row}><strong>Indirizzo:</strong> {profileData.indirizzo}</div>

              <div style={viewSectionTitle}>Dati fiscali</div>
              <div style={row}>
                <strong>Regime fiscale:</strong> {isVat ? 'Partita IVA' : 'Codice Fiscale'}
              </div>
              <div style={row}>
                <strong>{isVat ? 'Partita IVA' : 'Codice Fiscale'}:</strong>{' '}
                {profileData.valoreDocumentoFiscale}
              </div>

              <div style={lockedBox}>
                I dati fiscali e il regime fiscale non sono modificabili direttamente dal
                professionista perché influiscono su contratti, verifica documentale e gestione
                amministrativa.
                <br />
                <br />
                Per ottenere una modifica positiva devi prima caricare i documenti fiscali
                aggiornati nella sezione documenti.
              </div>

              {fiscalChangeRequested ? (
                <div style={requestSentBox}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    Richiesta modifica fiscale inviata
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    La tua richiesta è stata inviata all’amministrazione.
                  </div>
                  {fiscalChangeRequestedAt && (
                    <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>
                      <strong>Data richiesta:</strong>{' '}
                      {new Date(fiscalChangeRequestedAt).toLocaleString('it-IT')}
                    </div>
                  )}
                  {fiscalChangeRequestNote && (
                    <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>
                      <strong>Nota inviata:</strong> {fiscalChangeRequestNote}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {!showFiscalRequestBox ? (
                    <button
                      onClick={() => setShowFiscalRequestBox(true)}
                      style={{ ...secondaryButton, marginTop: 14 }}
                    >
                      Invia richiesta modifica regime fiscale
                    </button>
                  ) : (
                    <div style={requestFormBox}>
                      <div style={{ fontWeight: 800, color: colors.text, marginBottom: 8 }}>
                        Richiesta modifica regime fiscale
                      </div>
                      <div style={smallMutedText}>
                        Spiega cosa devi modificare. Ricorda di caricare prima i documenti fiscali
                        aggiornati.
                      </div>

                      <textarea
                        value={fiscalRequestNote}
                        onChange={(e) => setFiscalRequestNote(e.target.value)}
                        placeholder="Es. devo passare da codice fiscale a partita IVA / devo aggiornare i dati fiscali..."
                        style={textareaStyle}
                      />

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                        <button
                          onClick={() => {
                            setShowFiscalRequestBox(false);
                            setFiscalRequestNote('');
                          }}
                          style={secondaryButton}
                        >
                          Annulla
                        </button>

                        <button
                          onClick={handleSubmitFiscalChangeRequest}
                          style={saveInlineButton}
                        >
                          Invia richiesta
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={viewSectionTitle}>Dati di fatturazione</div>
              <div style={row}><strong>Intestatario:</strong> {profileData.intestatarioFatturazione || '-'}</div>
              <div style={row}><strong>Ragione sociale:</strong> {profileData.ragioneSociale || '-'}</div>
              <div style={row}><strong>Codice fiscale fatturazione:</strong> {profileData.codiceFiscaleFatturazione || '-'}</div>
              <div style={row}><strong>Partita IVA fatturazione:</strong> {profileData.partitaIvaFatturazione || '-'}</div>
              <div style={row}><strong>Indirizzo fatturazione:</strong> {profileData.indirizzoFatturazione || '-'}</div>
              <div style={row}><strong>Città fatturazione:</strong> {profileData.cittaFatturazione || '-'}</div>
              <div style={row}><strong>CAP:</strong> {profileData.capFatturazione || '-'}</div>
              <div style={row}><strong>Provincia:</strong> {profileData.provinciaFatturazione || '-'}</div>
              <div style={row}><strong>PEC:</strong> {profileData.pec || '-'}</div>
              <div style={row}><strong>Codice destinatario:</strong> {profileData.codiceDestinatario || '-'}</div>
            </>
          ) : (
            <>
              <div style={formSectionTitle}>Dati anagrafici e contatti</div>

              <div style={formGrid}>
                <div>
                  <div style={fieldLabel}>Nome</div>
                  <input
                    style={inputStyle}
                    value={profileForm.nome}
                    onChange={(e) => handleProfileChange('nome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Cognome</div>
                  <input
                    style={inputStyle}
                    value={profileForm.cognome}
                    onChange={(e) => handleProfileChange('cognome', e.target.value)}
                    placeholder="Cognome"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Email</div>
                  <input
                    style={inputStyle}
                    value={profileForm.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Telefono</div>
                  <input
                    style={inputStyle}
                    value={profileForm.telefono}
                    onChange={(e) => handleProfileChange('telefono', e.target.value)}
                    placeholder="Telefono"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Città</div>
                  <input
                    style={inputStyle}
                    value={profileForm.citta}
                    onChange={(e) => handleProfileChange('citta', e.target.value)}
                    placeholder="Città"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Indirizzo</div>
                  <input
                    style={inputStyle}
                    value={profileForm.indirizzo}
                    onChange={(e) => handleProfileChange('indirizzo', e.target.value)}
                    placeholder="Indirizzo"
                  />
                </div>
              </div>

              <div style={formSectionTitle}>
                {fiscalEditUnlocked ? 'Dati fiscali sbloccati da admin' : 'Dati fiscali bloccati'}
              </div>

              <div style={formGrid}>
                <div>
                  <div style={fieldLabel}>Regime fiscale</div>
                  {fiscalEditUnlocked ? (
                    <select
                      style={inputStyle}
                      value={profileForm.tipoDocumentoFiscale}
                      onChange={(e) => handleProfileChange('tipoDocumentoFiscale', e.target.value)}
                    >
                      <option value="piva">Partita IVA</option>
                      <option value="cf">Codice Fiscale</option>
                    </select>
                  ) : (
                    <input
                      style={lockedInputStyle}
                      value={profileForm.tipoDocumentoFiscale === 'piva' ? 'Partita IVA' : 'Codice Fiscale'}
                      disabled
                      readOnly
                    />
                  )}
                </div>

                <div>
                  <div style={fieldLabel}>
                    {profileForm.tipoDocumentoFiscale === 'piva' ? 'Partita IVA' : 'Codice Fiscale'}
                  </div>
                  <input
                    style={fiscalEditUnlocked ? inputStyle : lockedInputStyle}
                    value={profileForm.valoreDocumentoFiscale}
                    onChange={(e) => handleProfileChange('valoreDocumentoFiscale', e.target.value)}
                    disabled={!fiscalEditUnlocked}
                    readOnly={!fiscalEditUnlocked}
                    placeholder={
                      profileForm.tipoDocumentoFiscale === 'piva'
                        ? 'Inserisci Partita IVA'
                        : 'Inserisci Codice Fiscale'
                    }
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Codice fiscale fatturazione</div>
                  <input
                    style={fiscalEditUnlocked ? inputStyle : lockedInputStyle}
                    value={profileForm.codiceFiscaleFatturazione}
                    onChange={(e) => handleProfileChange('codiceFiscaleFatturazione', e.target.value)}
                    disabled={!fiscalEditUnlocked}
                    readOnly={!fiscalEditUnlocked}
                    placeholder="Codice fiscale fatturazione"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Partita IVA fatturazione</div>
                  <input
                    style={fiscalEditUnlocked ? inputStyle : lockedInputStyle}
                    value={profileForm.partitaIvaFatturazione}
                    onChange={(e) => handleProfileChange('partitaIvaFatturazione', e.target.value)}
                    disabled={!fiscalEditUnlocked}
                    readOnly={!fiscalEditUnlocked}
                    placeholder="Partita IVA fatturazione"
                  />
                </div>
              </div>

              <div style={lockedBox}>
                {fiscalEditUnlocked
                  ? 'I campi fiscali sono stati temporaneamente sbloccati dall’amministrazione. Dopo il salvataggio verranno nuovamente bloccati.'
                  : 'Questi campi sono bloccati perché influenzano contratti, verifica documentale e gestione amministrativa. Per richiedere una modifica fiscale devi contattare l’amministrazione via email.'}
              </div>

              <div style={formSectionTitle}>Dati di fatturazione modificabili</div>

              <div style={formGrid}>
                <div>
                  <div style={fieldLabel}>Intestatario fatturazione</div>
                  <input
                    style={inputStyle}
                    value={profileForm.intestatarioFatturazione}
                    onChange={(e) => handleProfileChange('intestatarioFatturazione', e.target.value)}
                    placeholder="Intestatario fatturazione"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Ragione sociale</div>
                  <input
                    style={inputStyle}
                    value={profileForm.ragioneSociale}
                    onChange={(e) => handleProfileChange('ragioneSociale', e.target.value)}
                    placeholder="Ragione sociale"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Indirizzo fatturazione</div>
                  <input
                    style={inputStyle}
                    value={profileForm.indirizzoFatturazione}
                    onChange={(e) => handleProfileChange('indirizzoFatturazione', e.target.value)}
                    placeholder="Indirizzo fatturazione"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Città fatturazione</div>
                  <input
                    style={inputStyle}
                    value={profileForm.cittaFatturazione}
                    onChange={(e) => handleProfileChange('cittaFatturazione', e.target.value)}
                    placeholder="Città fatturazione"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>CAP</div>
                  <input
                    style={inputStyle}
                    value={profileForm.capFatturazione}
                    onChange={(e) => handleProfileChange('capFatturazione', e.target.value)}
                    placeholder="CAP"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Provincia</div>
                  <input
                    style={inputStyle}
                    value={profileForm.provinciaFatturazione}
                    onChange={(e) => handleProfileChange('provinciaFatturazione', e.target.value)}
                    placeholder="Provincia"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>PEC</div>
                  <input
                    style={inputStyle}
                    value={profileForm.pec}
                    onChange={(e) => handleProfileChange('pec', e.target.value)}
                    placeholder="PEC"
                  />
                </div>

                <div>
                  <div style={fieldLabel}>Codice destinatario</div>
                  <input
                    style={inputStyle}
                    value={profileForm.codiceDestinatario}
                    onChange={(e) => handleProfileChange('codiceDestinatario', e.target.value)}
                    placeholder="Codice destinatario"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div style={gridCards}>
          <SectionCard
            title="Servizi offerti"
            subtitle={
              hasApprovedServices
                ? `${approvedServices.length} servizio/i approvato/i`
                : submittedServices.length > 0
                ? `${submittedServices.length} servizio/i inviato/i`
                : 'Selezione e verifica servizi'
            }
            onClick={() => onOpenSection('services')}
          />
          <SectionCard
            title="Prezzi servizi"
            subtitle={pricingSubtitle}
            onClick={() => onOpenSection('pricing')}
          />
          <SectionCard
            title="Documenti"
            subtitle={documentsSubtitle}
            onClick={() => onOpenSection('documents')}
          />
          <SectionCard
            title="Disponibilità"
            subtitle={availabilitySubtitle}
            onClick={() => onOpenSection('availability')}
          />
          <SectionCard
            title="Calendario"
            subtitle={calendarSubtitle}
            onClick={() => onOpenSection('calendar')}
          />
          <SectionCard
            title="Richieste"
            subtitle={requestsSubtitle}
            onClick={() => onOpenSection('requests')}
          />
          <SectionCard
            title="Informativa"
            subtitle="Privacy e condizioni"
            onClick={() => onOpenSection('info')}
          />
          <SectionCard
            title="Contratti"
            subtitle={contractsSubtitle}
            onClick={() => onOpenSection('contracts')}
          />
        </div>
      </div>

      <BottomNav current={currentTab} onChange={onChangeTab} />
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={sectionCardButton}>
      <div style={sectionCardTitle}>{title}</div>
      <div style={sectionCardSubtitle}>{subtitle}</div>
    </button>
  );
}

function BottomSingleButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 14,
        width: 360,
        height: 76,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 18px 32px rgba(0,0,0,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 14px',
        zIndex: 50,
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 16,
          padding: '14px 18px',
          background: '#FFF3E8',
          color: '#FF7A00',
          fontWeight: 800,
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    </div>
  );
}

function getStatusLabel(status: DocumentStatus) {
  switch (status) {
    case 'missing':
      return 'Mancante';
    case 'draft':
      return 'Bozza';
    case 'pending':
      return 'In verifica';
    case 'approved':
      return 'Approvato';
    case 'rejected':
      return 'Rifiutato';
    default:
      return status;
  }
}

function getServiceStatusLabel(status: ProfessionalServiceItem['status']) {
  switch (status) {
    case 'draft':
      return 'Bozza';
    case 'pending':
      return 'In verifica';
    case 'approved':
      return 'Approvato';
    case 'rejected':
      return 'Rifiutato';
    default:
      return status;
  }
}

function getStatusBadgeStyle(status: DocumentStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  switch (status) {
    case 'missing':
      return { ...base, background: '#F1F1F1', color: '#6F6F6F' };
    case 'draft':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'pending':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    case 'approved':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
    case 'rejected':
      return { ...base, background: '#FDECEC', color: '#C53B3B' };
    default:
      return base;
  }
}

function getServiceStatusBadgeStyle(
  status: ProfessionalServiceItem['status']
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  switch (status) {
    case 'draft':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'pending':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    case 'approved':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
    case 'rejected':
      return { ...base, background: '#FDECEC', color: '#C53B3B' };
    default:
      return base;
  }
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: '18px 18px 120px',
  background: 'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
};

const pageTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 800,
  color: colors.text,
  textAlign: 'center',
};

const pageSubtitle: React.CSSProperties = {
  color: colors.muted,
  marginTop: 8,
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 1.5,
};

const metaStatus: React.CSSProperties = {
  display: 'inline-block',
  borderRadius: 999,
  padding: '6px 12px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 14,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 18,
  boxShadow: colors.shadow,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: colors.text,
  marginBottom: 12,
};

const viewSectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: colors.text,
  marginTop: 18,
  marginBottom: 8,
};

const formSectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: colors.text,
  marginTop: 18,
  marginBottom: 12,
};

const row: React.CSSProperties = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.8,
};

const mutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const smallMutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 12,
  lineHeight: 1.5,
  marginTop: 4,
};

const noteBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: '#FFF8F1',
  border: '1px solid #F6E5D7',
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.6,
};

const lockedBox: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  background: '#FFF8F1',
  border: '1px solid #F6E5D7',
  color: '#8A5A2B',
  fontSize: 13,
  lineHeight: 1.6,
};

const requestSentBox: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  background: '#EEF6FF',
  border: '1px solid #D8E7FF',
  color: '#2F5EA8',
};

const requestFormBox: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  background: '#FFFDFC',
  border: '1px solid #F3E7DE',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 110,
  marginTop: 12,
  borderRadius: 14,
  border: '1px solid #ECD9CC',
  padding: 14,
  boxSizing: 'border-box',
  outline: 'none',
  color: colors.text,
  fontSize: 14,
  background: '#fff',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const pill: React.CSSProperties = {
  display: 'inline-block',
  borderRadius: 999,
  padding: '6px 12px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontSize: 12,
  fontWeight: 800,
};

const chipWarning: React.CSSProperties = {
  borderRadius: 999,
  padding: '8px 12px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontSize: 12,
  fontWeight: 800,
};

const statusBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: '#FFF8F1',
  color: '#FF6A00',
  fontWeight: 800,
};

const successBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: '#EAF8EF',
  color: '#228B4E',
  fontWeight: 800,
};

const rejectedBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: '#FDECEC',
  color: '#C53B3B',
  fontWeight: 800,
};

const gridCards: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const sectionCardButton: React.CSSProperties = {
  border: 'none',
  background: '#fff',
  borderRadius: 22,
  padding: 16,
  boxShadow: colors.shadow,
  textAlign: 'left',
  cursor: 'pointer',
};

const sectionCardTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 15,
  lineHeight: 1.4,
};

const sectionCardSubtitle: React.CSSProperties = {
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.5,
  marginTop: 6,
};

const documentCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 20,
  padding: 16,
  border: '1px solid #F3E7DE',
};

const serviceStatusCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 16,
  padding: 14,
  border: '1px solid #F3E7DE',
};

const documentTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 15,
  lineHeight: 1.4,
};

const documentInfoRow: React.CSSProperties = {
  color: colors.text,
  fontSize: 13,
  lineHeight: 1.7,
};

const rejectionText: React.CSSProperties = {
  marginTop: 8,
  color: '#C53B3B',
  fontSize: 13,
  lineHeight: 1.5,
  fontWeight: 700,
};

const uploadButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  padding: '12px 14px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
  border: 'none',
};

const secondaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '12px 14px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

const saveInlineButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '12px 14px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

const primaryFullButton: React.CSSProperties = {
  width: '100%',
  marginTop: 18,
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  fontWeight: 800,
  fontSize: 16,
};

const priceRowCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 20,
  padding: 16,
  border: '1px solid #F3E7DE',
};

const priceInputWrap: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#fff',
  border: '1px solid #ECD9CC',
  borderRadius: 16,
  padding: '0 14px',
  minHeight: 52,
};

const currencyLabel: React.CSSProperties = {
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 18,
};

const priceInput: React.CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: colors.text,
  fontSize: 16,
  fontWeight: 700,
  padding: '14px 0',
};

const checkRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  background: '#FFFDFC',
  border: '1px solid #F3E7DE',
  borderRadius: 18,
  padding: '12px 14px',
};

const donePill: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 12,
  fontWeight: 800,
};

const pendingPill: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#FFF8F1',
  color: '#FF7A00',
  fontSize: 12,
  fontWeight: 800,
};

const formGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const fieldLabel: React.CSSProperties = {
  color: colors.muted,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  borderRadius: 14,
  border: '1px solid #ECD9CC',
  padding: '0 14px',
  boxSizing: 'border-box',
  outline: 'none',
  color: colors.text,
  fontSize: 14,
  background: '#fff',
};

const lockedInputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  borderRadius: 14,
  border: '1px solid #E7DED6',
  padding: '0 14px',
  boxSizing: 'border-box',
  outline: 'none',
  color: '#7A746E',
  fontSize: 14,
  background: '#F7F3F0',
  cursor: 'not-allowed',
};