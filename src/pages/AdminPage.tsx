import React, { useMemo, useState } from 'react';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

type DocumentStatus = 'missing' | 'draft' | 'pending' | 'approved' | 'rejected';
type ContractStatus =
  | 'locked'
  | 'uploaded_by_admin'
  | 'ready_for_signature'
  | 'signed';

type ProfessionalServiceItem = {
  id: string;
  name: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

type ProfessionalDocument = {
  id: string;
  name: string;
  fileName?: string;
  uploadedAt?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  downloadUrl?: string;
};

type ProfessionalContract = {
  contractType: 'vat' | 'tax_code';
  status: ContractStatus;
  fileName?: string;
  uploadedAt?: string;
  availableAt?: string;
  signedAt?: string;
};

export type AdminProfessionalRecord = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  citta: string;
  indirizzo: string;
  fiscalType: 'piva' | 'cf';
  fiscalValue: string;
  createdAt: string;
  services: ProfessionalServiceItem[];
  documents: ProfessionalDocument[];
  contract: ProfessionalContract;
  isProfileActive: boolean;
  availabilitySaved: boolean;
  isDemo: boolean;
  requestStatus: 'Nuova' | 'In lavorazione' | 'Completata';
  activityStartAt?: string;
  intestatarioFatturazione?: string;
  ragioneSociale?: string;
  codiceFiscaleFatturazione?: string;
  partitaIvaFatturazione?: string;
  indirizzoFatturazione?: string;
  cittaFatturazione?: string;
  capFatturazione?: string;
  provinciaFatturazione?: string;
  pec?: string;
  codiceDestinatario?: string;
  fiscalChangeRequested?: boolean;
  fiscalChangeRequestedAt?: string;
  fiscalChangeRequestNote?: string;
};

export default function AdminPage({
  currentTab,
  onChangeTab,
  approvalRequests = [],
  fiscalEditUnlocked,
  onApproveService,
  onRejectService,
  onApproveDocument,
  onRejectDocument,
  onDownloadDocument,
  onUploadContract,
  onMakeContractReady,
  onUnlockFiscalEdit,
  onLockFiscalEdit,
  onLogout,
}: {
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  approvalRequests?: AdminProfessionalRecord[];
  fiscalEditUnlocked: boolean;
  onApproveService: (serviceId: string) => void;
  onRejectService: (serviceId: string) => void;
  onApproveDocument: (documentId: string) => void;
  onRejectDocument: (documentId: string) => void;
  onDownloadDocument: (documentId: string) => void;
  onUploadContract: (fileName: string) => void;
  onMakeContractReady: () => void;
  onUnlockFiscalEdit: () => void;
  onLockFiscalEdit: () => void;
  onLogout: () => void;
}) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [enabledFilter, setEnabledFilter] = useState<'all' | 'enabled' | 'not_enabled'>('all');
  const [fiscalFilter, setFiscalFilter] = useState<'all' | 'piva' | 'cf'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const demoRecords: AdminProfessionalRecord[] = [
    {
      id: 'demo-1',
      nome: 'Giulia',
      cognome: 'Romano',
      email: 'giulia.romano@beautygo.it',
      telefono: '+39 333 111 2233',
      citta: 'Milano',
      indirizzo: 'Via Torino 21',
      fiscalType: 'piva',
      fiscalValue: 'IT12345678901',
      createdAt: '2026-03-05T11:10:00.000Z',
      services: [
        { id: 's1', name: 'Piega', status: 'pending' },
        { id: 's2', name: 'Taglio donna', status: 'pending' },
        { id: 's3', name: 'Gloss', status: 'approved' },
        { id: 's4', name: 'Raccolto', status: 'pending' },
        {
          id: 's5',
          name: 'Semiraccolto',
          status: 'rejected',
          rejectionReason: 'Servizio non conforme',
        },
        { id: 's6', name: 'Capelli sposa', status: 'pending' },
      ],
      documents: [
        {
          id: 'd1',
          name: 'Documento di identità',
          fileName: 'carta_identita.pdf',
          status: 'approved',
        },
        {
          id: 'd2',
          name: 'Documento Partita IVA',
          fileName: 'visura_piva.pdf',
          status: 'pending',
        },
        {
          id: 'd3',
          name: 'Certificazione professionale',
          fileName: 'attestato_hair.pdf',
          status: 'pending',
        },
      ],
      contract: {
        contractType: 'vat',
        status: 'locked',
      },
      isProfileActive: false,
      availabilitySaved: false,
      isDemo: true,
      requestStatus: 'Nuova',
      activityStartAt: undefined,
      intestatarioFatturazione: 'Giulia Romano',
      ragioneSociale: 'Giulia Romano Beauty',
      codiceFiscaleFatturazione: 'RMNGLI90A41F205X',
      partitaIvaFatturazione: 'IT12345678901',
      indirizzoFatturazione: 'Via Torino 21',
      cittaFatturazione: 'Milano',
      capFatturazione: '20100',
      provinciaFatturazione: 'MI',
      pec: 'giulia@pec.it',
      codiceDestinatario: 'ABC1234',
      fiscalChangeRequested: false,
    },
    {
      id: 'demo-2',
      nome: 'Martina',
      cognome: 'Serra',
      email: 'martina.serra@beautygo.it',
      telefono: '+39 333 555 8899',
      citta: 'Bologna',
      indirizzo: 'Via Ugo Bassi 10',
      fiscalType: 'cf',
      fiscalValue: 'SRRMTN90A41F205X',
      createdAt: '2026-03-01T14:30:00.000Z',
      services: [
        { id: 's1', name: 'Semipermanente', status: 'approved' },
        { id: 's2', name: 'Manicure base', status: 'approved' },
        { id: 's3', name: 'Pedicure completo', status: 'pending' },
        { id: 's4', name: 'Trucco sera', status: 'approved' },
      ],
      documents: [
        {
          id: 'd1',
          name: 'Documento di identità',
          fileName: 'carta_id_martina.pdf',
          status: 'approved',
        },
        {
          id: 'd2',
          name: 'Codice Fiscale / Tessera sanitaria',
          fileName: 'codice_fiscale.pdf',
          status: 'approved',
        },
        {
          id: 'd3',
          name: 'Certificazione professionale',
          fileName: 'cert_estetica.pdf',
          status: 'pending',
        },
      ],
      contract: {
        contractType: 'tax_code',
        status: 'uploaded_by_admin',
        fileName: 'contratto_martina.pdf',
        uploadedAt: '2026-03-08T10:00:00.000Z',
      },
      isProfileActive: false,
      availabilitySaved: true,
      isDemo: true,
      requestStatus: 'In lavorazione',
      activityStartAt: undefined,
      intestatarioFatturazione: 'Martina Serra',
      ragioneSociale: '',
      codiceFiscaleFatturazione: 'SRRMTN90A41F205X',
      partitaIvaFatturazione: '',
      indirizzoFatturazione: 'Via Ugo Bassi 10',
      cittaFatturazione: 'Bologna',
      capFatturazione: '40121',
      provinciaFatturazione: 'BO',
      pec: '',
      codiceDestinatario: '',
      fiscalChangeRequested: false,
    },
  ];

  const safeApprovalRequests =
    Array.isArray(approvalRequests) && approvalRequests.length > 0
      ? approvalRequests
      : demoRecords;

  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(
        safeApprovalRequests
          .map((record) => record.citta?.trim())
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b, 'it'));

    return uniqueCities;
  }, [safeApprovalRequests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return safeApprovalRequests.filter((record) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        record.nome.toLowerCase().includes(normalizedSearch) ||
        record.cognome.toLowerCase().includes(normalizedSearch) ||
        `${record.nome} ${record.cognome}`.toLowerCase().includes(normalizedSearch) ||
        record.fiscalValue.toLowerCase().includes(normalizedSearch);

      const matchesEnabled =
        enabledFilter === 'all' ||
        (enabledFilter === 'enabled' && record.isProfileActive) ||
        (enabledFilter === 'not_enabled' && !record.isProfileActive);

      const matchesFiscal =
        fiscalFilter === 'all' || record.fiscalType === fiscalFilter;

      const matchesCity =
        cityFilter === 'all' || record.citta === cityFilter;

      return matchesSearch && matchesEnabled && matchesFiscal && matchesCity;
    });
  }, [safeApprovalRequests, searchTerm, enabledFilter, fiscalFilter, cityFilter]);

  const selectedRecord =
    safeApprovalRequests.find((record) => record.id === selectedRequestId) ?? null;

  const exportToExcel = () => {
    const rows = filteredRequests.map((record) => {
      const approvedServicesCount = record.services.filter(
        (service) => service.status === 'approved'
      ).length;
      const approvedDocumentsCount = record.documents.filter(
        (doc) => doc.status === 'approved'
      ).length;

      return {
        Nome: record.nome,
        Cognome: record.cognome,
        Email: record.email,
        Telefono: record.telefono,
        Citta: record.citta,
        Indirizzo: record.indirizzo,
        TipoDocumentoFiscale: record.fiscalType === 'piva' ? 'Partita IVA' : 'Codice Fiscale',
        ValoreDocumentoFiscale: record.fiscalValue,
        DataIscrizione: formatDateTime(record.createdAt),
        ServiziTotali: String(record.services.length),
        ServiziApprovati: String(approvedServicesCount),
        DocumentiTotali: String(record.documents.length),
        DocumentiApprovati: String(approvedDocumentsCount),
        DisponibilitaSalvata: record.availabilitySaved ? 'Sì' : 'No',
        StatoContratto: record.contract.status,
        DataFirmaContratto: record.contract.signedAt ? formatDateTime(record.contract.signedAt) : '',
        AvvioAttivita: record.activityStartAt ? formatDateTime(record.activityStartAt) : '',
        ProfiloAttivo: record.isProfileActive ? 'Sì' : 'No',
        StatoRichiesta: record.requestStatus,
        ModificaFiscaleSbloccata: !record.isDemo ? (fiscalEditUnlocked ? 'Sì' : 'No') : 'Demo',
        RichiestaModificaFiscale: !record.isDemo ? (record.fiscalChangeRequested ? 'Sì' : 'No') : 'Demo',
        DataRichiestaModificaFiscale:
          !record.isDemo && record.fiscalChangeRequestedAt
            ? formatDateTime(record.fiscalChangeRequestedAt)
            : '',
        NotaRichiestaModificaFiscale:
          !record.isDemo ? record.fiscalChangeRequestNote || '' : 'Demo',
        IntestatarioFatturazione: record.intestatarioFatturazione || '',
        RagioneSociale: record.ragioneSociale || '',
        CodiceFiscaleFatturazione: record.codiceFiscaleFatturazione || '',
        PartitaIvaFatturazione: record.partitaIvaFatturazione || '',
        IndirizzoFatturazione: record.indirizzoFatturazione || '',
        CittaFatturazione: record.cittaFatturazione || '',
        CapFatturazione: record.capFatturazione || '',
        ProvinciaFatturazione: record.provinciaFatturazione || '',
        Pec: record.pec || '',
        CodiceDestinatario: record.codiceDestinatario || '',
      };
    });

    const headers = [
      'Nome',
      'Cognome',
      'Email',
      'Telefono',
      'Citta',
      'Indirizzo',
      'TipoDocumentoFiscale',
      'ValoreDocumentoFiscale',
      'DataIscrizione',
      'ServiziTotali',
      'ServiziApprovati',
      'DocumentiTotali',
      'DocumentiApprovati',
      'DisponibilitaSalvata',
      'StatoContratto',
      'DataFirmaContratto',
      'AvvioAttivita',
      'ProfiloAttivo',
      'StatoRichiesta',
      'ModificaFiscaleSbloccata',
      'RichiestaModificaFiscale',
      'DataRichiestaModificaFiscale',
      'NotaRichiestaModificaFiscale',
      'IntestatarioFatturazione',
      'RagioneSociale',
      'CodiceFiscaleFatturazione',
      'PartitaIvaFatturazione',
      'IndirizzoFatturazione',
      'CittaFatturazione',
      'CapFatturazione',
      'ProvinciaFatturazione',
      'Pec',
      'CodiceDestinatario',
    ];

    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${escapeHtml(row[header as keyof typeof row] ?? '')}</td>`)
            .join('')}</tr>`
      )
      .join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          <table border="1">
            <thead>
              <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beautygo-professionisti-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (selectedRecord) {
    const isVat = selectedRecord.fiscalType === 'piva';
    const approvedServicesCount = selectedRecord.services.filter(
      (service) => service.status === 'approved'
    ).length;
    const approvedDocumentsCount = selectedRecord.documents.filter(
      (doc) => doc.status === 'approved'
    ).length;

    if (selectedRecord.isDemo) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '18px 18px 120px',
            background: 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 100%)',
          }}
        >
          <div style={topBar}>
            <div>
              <h1 style={{ ...titleStyle, textAlign: 'left' }}>Scheda professionista</h1>
              <p style={{ ...subtitleStyle, textAlign: 'left' }}>Dati demo di esempio.</p>
            </div>

            <button onClick={onLogout} style={logoutButton}>
              Esci
            </button>
          </div>

          <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
            <div style={card}>
              <div style={sectionTitle}>Dati professionista</div>
              <div style={row}><strong>Nome:</strong> {selectedRecord.nome}</div>
              <div style={row}><strong>Cognome:</strong> {selectedRecord.cognome}</div>
              <div style={row}><strong>Email:</strong> {selectedRecord.email}</div>
              <div style={row}><strong>Telefono:</strong> {selectedRecord.telefono}</div>
              <div style={row}><strong>Città:</strong> {selectedRecord.citta}</div>
              <div style={row}><strong>Indirizzo:</strong> {selectedRecord.indirizzo}</div>
              <div style={row}>
                <strong>{isVat ? 'Partita IVA' : 'Codice Fiscale'}:</strong> {selectedRecord.fiscalValue}
              </div>
              <div style={row}>
                <strong>Data iscrizione:</strong> {formatDateTime(selectedRecord.createdAt)}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Servizi inviati</div>

              <div style={{ display: 'grid', gap: 12 }}>
                {selectedRecord.services.map((service) => (
                  <div key={service.id} style={documentCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={documentTitle}>{service.name}</div>
                        <div style={{ marginTop: 6 }}>
                          <span style={serviceStatusPill(service.status)}>
                            {getServiceStatusLabel(service.status)}
                          </span>
                        </div>
                        {service.rejectionReason && (
                          <div style={rejectionText}>
                            Motivo rifiuto: {service.rejectionReason}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => alert('Demo: servizio approvato')}
                          style={miniApproveButton}
                        >
                          Approva
                        </button>

                        <button
                          onClick={() => alert('Demo: servizio rifiutato')}
                          style={miniRejectButton}
                        >
                          Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Documenti inviati</div>

              <div style={{ display: 'grid', gap: 12 }}>
                {selectedRecord.documents.map((doc) => (
                  <div key={doc.id} style={documentCard}>
                    <div style={documentTitle}>{doc.name}</div>
                    <div style={smallMutedText}>{doc.fileName}</div>

                    <div style={{ marginTop: 6 }}>
                      <span style={statusPill(doc.status)}>{doc.status}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => alert('Demo: documento non scaricabile')}
                        style={secondaryMiniButton}
                      >
                        Scarica
                      </button>

                      <button
                        onClick={() => alert('Demo: documento approvato')}
                        style={miniApproveButton}
                      >
                        Approva
                      </button>

                      <button
                        onClick={() => alert('Demo: documento rifiutato')}
                        style={miniRejectButton}
                      >
                        Rifiuta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Contratto</div>

              <div style={row}><strong>Tipo:</strong> {selectedRecord.contract.contractType === 'vat' ? 'Partita IVA' : 'Codice Fiscale'}</div>
              <div style={row}><strong>Stato:</strong> {selectedRecord.contract.status}</div>
              <div style={row}><strong>Data firma:</strong> {selectedRecord.contract.signedAt ? formatDateTime(selectedRecord.contract.signedAt) : 'Non disponibile'}</div>
              <div style={row}><strong>Avvio attività:</strong> {selectedRecord.activityStartAt ? formatDateTime(selectedRecord.activityStartAt) : 'Non disponibile'}</div>

              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => alert('Demo: contratto caricato')}
                  style={approveButton}
                >
                  Carica contratto
                </button>

                <button
                  onClick={() => alert('Demo: pronto per firma')}
                  style={approveButton}
                >
                  Rendi disponibile alla firma
                </button>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Stato finale profilo</div>

              <div style={selectedRecord.isProfileActive ? activeBadge : inactiveBadge}>
                {selectedRecord.isProfileActive ? 'Profilo attivo' : 'Profilo non ancora attivo'}
              </div>

              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                <div style={checkRow}>
                  <div style={checkText}>Almeno un servizio approvato</div>
                  <div style={approvedServicesCount > 0 ? donePill : pendingPill}>
                    {approvedServicesCount > 0 ? 'OK' : 'NO'}
                  </div>
                </div>

                <div style={checkRow}>
                  <div style={checkText}>Documenti approvati</div>
                  <div style={approvedDocumentsCount >= 3 ? donePill : pendingPill}>
                    {approvedDocumentsCount >= 3 ? 'OK' : 'NO'}
                  </div>
                </div>

                <div style={checkRow}>
                  <div style={checkText}>Disponibilità salvata</div>
                  <div style={selectedRecord.availabilitySaved ? donePill : pendingPill}>
                    {selectedRecord.availabilitySaved ? 'OK' : 'NO'}
                  </div>
                </div>

                <div style={checkRow}>
                  <div style={checkText}>Contratto firmato</div>
                  <div style={selectedRecord.contract.status === 'signed' ? donePill : pendingPill}>
                    {selectedRecord.contract.status === 'signed' ? 'OK' : 'NO'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BottomBackButton onClick={() => setSelectedRequestId(null)} />
        </div>
      );
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '18px 18px 120px',
          background: 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 100%)',
        }}
      >
        <div style={topBar}>
          <div>
            <h1 style={{ ...titleStyle, textAlign: 'left' }}>Scheda professionista</h1>
            <p style={{ ...subtitleStyle, textAlign: 'left' }}>
              Gestisci verifiche, documenti, contratto e modifica fiscale.
            </p>
          </div>

          <button onClick={onLogout} style={logoutButton}>
            Esci
          </button>
        </div>

        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          <div style={card}>
            <div style={sectionTitle}>Dati professionista</div>
            <div style={row}><strong>Nome:</strong> {selectedRecord.nome}</div>
            <div style={row}><strong>Cognome:</strong> {selectedRecord.cognome}</div>
            <div style={row}><strong>Email:</strong> {selectedRecord.email}</div>
            <div style={row}><strong>Telefono:</strong> {selectedRecord.telefono}</div>
            <div style={row}><strong>Città:</strong> {selectedRecord.citta}</div>
            <div style={row}><strong>Indirizzo:</strong> {selectedRecord.indirizzo}</div>
            <div style={row}>
              <strong>{isVat ? 'Partita IVA' : 'Codice Fiscale'}:</strong>{' '}
              {selectedRecord.fiscalValue}
            </div>
            <div style={row}>
              <strong>Data iscrizione:</strong>{' '}
              {formatDateTime(selectedRecord.createdAt)}
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Dati fatturazione</div>
            <div style={row}><strong>Intestatario:</strong> {selectedRecord.intestatarioFatturazione || '-'}</div>
            <div style={row}><strong>Ragione sociale:</strong> {selectedRecord.ragioneSociale || '-'}</div>
            <div style={row}><strong>Codice fiscale fatturazione:</strong> {selectedRecord.codiceFiscaleFatturazione || '-'}</div>
            <div style={row}><strong>Partita IVA fatturazione:</strong> {selectedRecord.partitaIvaFatturazione || '-'}</div>
            <div style={row}><strong>Indirizzo fatturazione:</strong> {selectedRecord.indirizzoFatturazione || '-'}</div>
            <div style={row}><strong>Città fatturazione:</strong> {selectedRecord.cittaFatturazione || '-'}</div>
            <div style={row}><strong>CAP:</strong> {selectedRecord.capFatturazione || '-'}</div>
            <div style={row}><strong>Provincia:</strong> {selectedRecord.provinciaFatturazione || '-'}</div>
            <div style={row}><strong>PEC:</strong> {selectedRecord.pec || '-'}</div>
            <div style={row}><strong>Codice destinatario:</strong> {selectedRecord.codiceDestinatario || '-'}</div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Modifica fiscale</div>

            <div style={fiscalEditUnlocked ? activeFiscalBox : lockedFiscalBox}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>
                {fiscalEditUnlocked
                  ? 'Modifica fiscale attualmente sbloccata'
                  : 'Modifica fiscale bloccata'}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                {fiscalEditUnlocked
                  ? 'Il professionista può modificare temporaneamente regime fiscale e dati fiscali. Dopo il salvataggio i campi verranno nuovamente bloccati.'
                  : 'I campi fiscali del professionista sono protetti. Sblocca solo se vuoi consentire una modifica amministrata di Partita IVA, Codice Fiscale o regime fiscale.'}
              </div>
            </div>

            {selectedRecord.fiscalChangeRequested && (
              <div style={requestAdminBox}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Richiesta ricevuta dal professionista
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {selectedRecord.fiscalChangeRequestedAt
                    ? `Data richiesta: ${formatDateTime(selectedRecord.fiscalChangeRequestedAt)}`
                    : 'Data richiesta non disponibile'}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>
                  Il professionista richiede la modifica del regime fiscale. Prima di procedere,
                  verifica che siano stati caricati anche i documenti fiscali aggiornati.
                </div>
                {selectedRecord.fiscalChangeRequestNote && (
                  <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
                    <strong>Nota professionista:</strong> {selectedRecord.fiscalChangeRequestNote}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              {!fiscalEditUnlocked ? (
                <button onClick={onUnlockFiscalEdit} style={approveButton}>
                  Sblocca modifica fiscale
                </button>
              ) : (
                <button onClick={onLockFiscalEdit} style={miniRejectWideButton}>
                  Blocca modifica fiscale
                </button>
              )}
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Servizi inviati</div>

            {selectedRecord.services.length === 0 ? (
              <div style={mutedText}>Nessun servizio inviato.</div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {selectedRecord.services.map((service) => (
                  <div key={service.id} style={documentCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={documentTitle}>{service.name}</div>
                        <div style={{ marginTop: 6 }}>
                          <span style={serviceStatusPill(service.status)}>
                            {getServiceStatusLabel(service.status)}
                          </span>
                        </div>
                        {service.rejectionReason && (
                          <div style={rejectionText}>
                            Motivo rifiuto: {service.rejectionReason}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button onClick={() => onApproveService(service.id)} style={miniApproveButton}>
                          Approva
                        </button>
                        <button onClick={() => onRejectService(service.id)} style={miniRejectButton}>
                          Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Documenti inviati</div>

            {selectedRecord.documents.length === 0 ? (
              <div style={mutedText}>Nessun documento disponibile.</div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {selectedRecord.documents.map((doc) => (
                  <div key={doc.id} style={documentCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={documentTitle}>{doc.name}</div>
                        <div style={smallMutedText}>
                          {doc.fileName || 'Nessun file caricato'}
                        </div>
                        {doc.uploadedAt && (
                          <div style={smallMutedText}>
                            Caricato il: {formatDateTime(doc.uploadedAt)}
                          </div>
                        )}
                        <div style={{ marginTop: 6 }}>
                          <span style={statusPill(doc.status)}>{doc.status}</span>
                        </div>
                        {doc.rejectionReason && (
                          <div style={rejectionText}>
                            Motivo rifiuto: {doc.rejectionReason}
                          </div>
                        )}
                      </div>

                      {doc.fileName && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            onClick={() => onDownloadDocument(doc.id)}
                            style={secondaryMiniButton}
                          >
                            Scarica
                          </button>
                          <button
                            onClick={() => onApproveDocument(doc.id)}
                            style={miniApproveButton}
                          >
                            Approva
                          </button>
                          <button
                            onClick={() => onRejectDocument(doc.id)}
                            style={miniRejectButton}
                          >
                            Rifiuta
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Contratto</div>

            <div style={row}>
              <strong>Tipo:</strong>{' '}
              {selectedRecord.contract.contractType === 'vat' ? 'Partita IVA' : 'Codice Fiscale'}
            </div>
            <div style={row}>
              <strong>Stato:</strong> {selectedRecord.contract.status}
            </div>
            {selectedRecord.contract.fileName && (
              <div style={row}>
                <strong>File:</strong> {selectedRecord.contract.fileName}
              </div>
            )}
            {selectedRecord.contract.uploadedAt && (
              <div style={row}>
                <strong>Caricato il:</strong>{' '}
                {formatDateTime(selectedRecord.contract.uploadedAt)}
              </div>
            )}
            <div style={row}>
              <strong>Data firma contratto:</strong>{' '}
              {selectedRecord.contract.signedAt
                ? formatDateTime(selectedRecord.contract.signedAt)
                : 'Non disponibile'}
            </div>
            <div style={row}>
              <strong>Avvio attività:</strong>{' '}
              {selectedRecord.activityStartAt
                ? formatDateTime(selectedRecord.activityStartAt)
                : 'Non disponibile'}
            </div>

            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              <label style={uploadButton}>
                Carica contratto
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    onUploadContract(file.name);
                    e.currentTarget.value = '';
                  }}
                />
              </label>

              <button onClick={onMakeContractReady} style={approveButton}>
                Rendi disponibile alla firma
              </button>
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Stato finale profilo</div>

            <div style={selectedRecord.isProfileActive ? activeBadge : inactiveBadge}>
              {selectedRecord.isProfileActive ? 'Profilo attivo' : 'Profilo non ancora attivo'}
            </div>

            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              <div style={checkRow}>
                <div style={checkText}>Almeno un servizio approvato</div>
                <div style={approvedServicesCount > 0 ? donePill : pendingPill}>
                  {approvedServicesCount > 0 ? 'OK' : 'NO'}
                </div>
              </div>

              <div style={checkRow}>
                <div style={checkText}>Documenti approvati</div>
                <div style={approvedDocumentsCount >= 3 ? donePill : pendingPill}>
                  {approvedDocumentsCount >= 3 ? 'OK' : 'NO'}
                </div>
              </div>

              <div style={checkRow}>
                <div style={checkText}>Disponibilità salvata</div>
                <div style={selectedRecord.availabilitySaved ? donePill : pendingPill}>
                  {selectedRecord.availabilitySaved ? 'OK' : 'NO'}
                </div>
              </div>

              <div style={checkRow}>
                <div style={checkText}>Contratto firmato</div>
                <div style={selectedRecord.contract.status === 'signed' ? donePill : pendingPill}>
                  {selectedRecord.contract.status === 'signed' ? 'OK' : 'NO'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomBackButton onClick={() => setSelectedRequestId(null)} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 120px',
        background: 'linear-gradient(180deg, #1E1E1E 0%, #2A2A2A 100%)',
      }}
    >
      <div style={topBar}>
        <div>
          <h1 style={{ ...titleStyle, textAlign: 'left' }}>Richieste approvazione</h1>
          <p style={{ ...subtitleStyle, textAlign: 'left' }}>
            Elenco professionisti da verificare e attivare.
          </p>
        </div>

        <button onClick={onLogout} style={logoutButton}>
          Esci
        </button>
      </div>

      <div style={{ ...card, marginTop: 18 }}>
        <div style={sectionTitle}>Ricerca e filtri</div>

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per nome, cognome, codice fiscale o partita IVA"
            style={searchInput}
          />

          <div style={filtersGrid}>
            <select
              value={enabledFilter}
              onChange={(e) =>
                setEnabledFilter(e.target.value as 'all' | 'enabled' | 'not_enabled')
              }
              style={filterSelect}
            >
              <option value="all">Tutti gli stati</option>
              <option value="enabled">Solo abilitati</option>
              <option value="not_enabled">Solo non abilitati</option>
            </select>

            <select
              value={fiscalFilter}
              onChange={(e) => setFiscalFilter(e.target.value as 'all' | 'piva' | 'cf')}
              style={filterSelect}
            >
              <option value="all">Tutti i documenti fiscali</option>
              <option value="piva">Solo Partita IVA</option>
              <option value="cf">Solo Codice Fiscale</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={filterSelect}
            >
              <option value="all">Tutte le città</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button onClick={exportToExcel} style={exportButton}>
              Esporta Excel
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        {filteredRequests.length === 0 ? (
          <div style={emptyStateCard}>
            Nessun professionista trovato con i filtri selezionati.
          </div>
        ) : (
          filteredRequests.map((request) => {
            const approvedServicesCount = request.services.filter(
              (service) => service.status === 'approved'
            ).length;

            const pendingDocsCount = request.documents.filter(
              (doc) => doc.status === 'pending' || doc.status === 'draft'
            ).length;

            return (
              <button
                key={request.id}
                onClick={() => setSelectedRequestId(request.id)}
                style={requestCardButton}
              >
                <div style={requestCardHeader}>
                  <div>
                    <div style={requestTitle}>
                      {request.nome} {request.cognome}
                    </div>
                    <div style={requestSubtitle}>{request.email}</div>
                    <div style={requestDate}>
                      Richiesta arrivata il: {formatDateTime(request.createdAt)}
                    </div>
                    <div style={{ ...requestDate, marginTop: 4 }}>
                      {request.fiscalType === 'piva' ? 'Partita IVA' : 'Codice Fiscale'}: {request.fiscalValue}
                    </div>
                    <div style={{ ...requestDate, marginTop: 4 }}>
                      Città: {request.citta}
                    </div>
                  </div>
                  <div style={request.isProfileActive ? activeSmallBadge : inactiveSmallBadge}>
                    {request.isProfileActive ? 'Attivo' : request.isDemo ? 'Demo' : 'Da verificare'}
                  </div>
                </div>

                <div style={requestMetaGrid}>
                  <div style={metaBox}>
                    <div style={metaLabel}>Servizi</div>
                    <div style={metaValue}>{request.services.length}</div>
                  </div>
                  <div style={metaBox}>
                    <div style={metaLabel}>Servizi OK</div>
                    <div style={metaValue}>{approvedServicesCount}</div>
                  </div>
                  <div style={metaBox}>
                    <div style={metaLabel}>Doc. da gestire</div>
                    <div style={metaValue}>{pendingDocsCount}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  <div style={approvedServicesCount > 0 ? donePill : pendingPill}>
                    {approvedServicesCount > 0 ? 'Servizi OK' : 'Servizi da approvare'}
                  </div>
                  <div style={contractBadge(request.contract.status)}>
                    Contratto: {request.contract.status}
                  </div>
                  <div style={requestStatusBadge(request.requestStatus)}>
                    {request.requestStatus}
                  </div>
                  {!request.isDemo && (
                    <div style={fiscalEditUnlocked ? fiscalOnBadge : fiscalOffBadge}>
                      {fiscalEditUnlocked ? 'Modifica fiscale sbloccata' : 'Modifica fiscale bloccata'}
                    </div>
                  )}
                  {!request.isDemo && request.fiscalChangeRequested && (
                    <div style={fiscalRequestBadge}>
                      Richiesta modifica fiscale
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      <BottomNav current={currentTab} onChange={onChangeTab} />
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) return 'Non disponibile';
  return new Date(value).toLocaleString('it-IT');
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function BottomBackButton({ onClick }: { onClick: () => void }) {
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
        ← Torna alle richieste
      </button>
    </div>
  );
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

function serviceStatusPill(
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
    case 'approved':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
    case 'pending':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    case 'draft':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'rejected':
      return { ...base, background: '#FDECEC', color: '#C53B3B' };
    default:
      return { ...base, background: '#F1F1F1', color: '#6F6F6F' };
  }
}

function statusPill(status: DocumentStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'capitalize',
  };

  switch (status) {
    case 'approved':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
    case 'pending':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    case 'draft':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'rejected':
      return { ...base, background: '#FDECEC', color: '#C53B3B' };
    default:
      return { ...base, background: '#F1F1F1', color: '#6F6F6F' };
  }
}

function contractBadge(status: ContractStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  switch (status) {
    case 'signed':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
    case 'ready_for_signature':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'uploaded_by_admin':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    default:
      return { ...base, background: '#F1F1F1', color: '#6F6F6F' };
  }
}

function requestStatusBadge(status: string): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  if (status === 'Completata') {
    return { ...base, background: '#EAF8EF', color: '#228B4E' };
  }

  if (status === 'In lavorazione') {
    return { ...base, background: '#FFF3E8', color: '#FF6A00' };
  }

  return { ...base, background: '#EEF2FF', color: '#4453C3' };
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 800,
  color: '#fff',
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  color: '#D6D6D6',
  marginTop: 8,
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 1.5,
};

const topBar: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  flexWrap: 'wrap',
};

const logoutButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: '10px 14px',
  background: '#FFEAEA',
  color: '#C53B3B',
  fontWeight: 800,
  cursor: 'pointer',
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 18px 32px rgba(0,0,0,0.12)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: colors.text,
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

const approveButton: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
};

const miniApproveButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  padding: '10px 12px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

const miniRejectButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  padding: '10px 12px',
  background: '#FDECEC',
  color: '#C53B3B',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

const miniRejectWideButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  background: '#FDECEC',
  color: '#C53B3B',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
};

const secondaryMiniButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  padding: '10px 12px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

const uploadButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  padding: '14px 16px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
};

const documentCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 20,
  padding: 16,
  border: '1px solid #F3E7DE',
};

const documentTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 15,
  lineHeight: 1.4,
};

const rejectionText: React.CSSProperties = {
  marginTop: 8,
  color: '#C53B3B',
  fontSize: 13,
  lineHeight: 1.5,
  fontWeight: 700,
};

const activeBadge: React.CSSProperties = {
  display: 'inline-block',
  borderRadius: 999,
  padding: '8px 14px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 13,
  fontWeight: 800,
};

const inactiveBadge: React.CSSProperties = {
  display: 'inline-block',
  borderRadius: 999,
  padding: '8px 14px',
  background: '#FFF8F1',
  color: '#FF7A00',
  fontSize: 13,
  fontWeight: 800,
};

const activeFiscalBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: '#EAF8EF',
  border: '1px solid #D9EFDF',
  color: '#228B4E',
};

const lockedFiscalBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: '#FFF8F1',
  border: '1px solid #F6E5D7',
  color: '#8A5A2B',
};

const requestAdminBox: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  background: '#EEF6FF',
  border: '1px solid #D8E7FF',
  color: '#2F5EA8',
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

const checkText: React.CSSProperties = {
  color: colors.text,
  fontSize: 14,
  fontWeight: 700,
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

const fiscalOnBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 12,
  fontWeight: 800,
};

const fiscalOffBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#FDECEC',
  color: '#C53B3B',
  fontSize: 12,
  fontWeight: 800,
};

const fiscalRequestBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#EEF6FF',
  color: '#2F5EA8',
  fontSize: 12,
  fontWeight: 800,
};

const requestCardButton: React.CSSProperties = {
  border: 'none',
  background: '#fff',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 18px 32px rgba(0,0,0,0.12)',
  textAlign: 'left',
  cursor: 'pointer',
};

const requestCardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
};

const requestTitle: React.CSSProperties = {
  color: colors.text,
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.4,
};

const requestSubtitle: React.CSSProperties = {
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.5,
  marginTop: 4,
};

const requestDate: React.CSSProperties = {
  color: '#6F6F6F',
  fontSize: 12,
  fontWeight: 700,
  marginTop: 8,
};

const activeSmallBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 12,
  fontWeight: 800,
};

const inactiveSmallBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 12px',
  background: '#FFF8F1',
  color: '#FF7A00',
  fontSize: 12,
  fontWeight: 800,
};

const requestMetaGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 10,
  marginTop: 14,
};

const metaBox: React.CSSProperties = {
  background: '#FFFDFC',
  border: '1px solid #F3E7DE',
  borderRadius: 16,
  padding: '12px 10px',
};

const metaLabel: React.CSSProperties = {
  color: colors.muted,
  fontSize: 12,
  fontWeight: 700,
};

const metaValue: React.CSSProperties = {
  color: colors.text,
  fontSize: 18,
  fontWeight: 800,
  marginTop: 4,
};

const searchInput: React.CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid #E5D5C7',
  padding: '14px 16px',
  fontSize: 14,
  outline: 'none',
  color: colors.text,
  background: '#FFFDFC',
};

const filtersGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 10,
};

const filterSelect: React.CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid #E5D5C7',
  padding: '14px 16px',
  fontSize: 14,
  outline: 'none',
  color: colors.text,
  background: '#FFFDFC',
};

const exportButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  background: '#1F2937',
  color: '#fff',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
};

const emptyStateCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 18px 32px rgba(0,0,0,0.12)',
  color: colors.muted,
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 1.6,
};