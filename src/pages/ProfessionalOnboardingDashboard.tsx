import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme';
import {
  buildOnboardingSteps,
  getProgressPercent,
  getServicesStepStatus,
  getAvailabilityStepStatus,
  getDocumentsStepStatus,
  type AvailabilityRecord,
  type DocumentRecord,
  type OnboardingStep,
  type ProfileForOnboarding,
  type ServiceRecord,
} from '../lib/onboarding';
import ServicesStep from '../components/onboarding/ServicesStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import DocumentsStep from '../components/onboarding/DocumentsStep';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';
type EditorKey = 'base' | 'fiscal' | 'services' | 'availability' | 'documents';

type ProfileForm = ProfileForOnboarding & {
  email?: string | null;
  ragioneSociale?: string | null;
  indirizzoFatturazione?: string | null;
  cittaFatturazione?: string | null;
  capFatturazione?: string | null;
  provinciaFatturazione?: string | null;
};

const statusLabel: Record<OnboardingStep['status'], string> = {
  todo: 'Da fare',
  completed: 'Completato',
  in_review: 'In revisione',
  approved: 'Approvato',
  rejected: 'Da correggere',
};

const statusStyle: Record<OnboardingStep['status'], CSSProperties> = {
  todo: { background: '#F3F4F6', color: '#6B7280' },
  completed: { background: '#DBEAFE', color: '#1D4ED8' },
  in_review: { background: '#FEF3C7', color: '#B45309' },
  approved: { background: '#DCFCE7', color: '#166534' },
  rejected: { background: '#FEE2E2', color: '#B91C1C' },
};

export default function ProfessionalOnboardingDashboard({
  professionalId,
  currentTab,
  onChangeTab,
  profile,
  onSaveBaseProfile,
  onSaveFiscalData,
  onSubmitOnboarding,
  onLogout,
}: {
  professionalId: string;
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  profile: ProfileForm;
  onSaveBaseProfile: (payload: ProfileForm) => Promise<void>;
  onSaveFiscalData: (payload: ProfileForm) => Promise<void>;
  onSubmitOnboarding: () => Promise<void>;
  onLogout: () => void;
}) {
  const [editor, setEditor] = useState<EditorKey>('base');
  const [baseForm, setBaseForm] = useState<ProfileForm>(profile);
  const [fiscalForm, setFiscalForm] = useState<ProfileForm>(profile);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setBaseForm(profile);
    setFiscalForm(profile);
  }, [profile]);

  const steps = useMemo(
    () => buildOnboardingSteps(profile, services, availability, documents),
    [profile, services, availability, documents]
  );
  const progress = useMemo(() => getProgressPercent(steps), [steps]);

  const servicesReady = ['completed', 'approved', 'in_review'].includes(getServicesStepStatus(services));
  const availabilityReady = ['completed', 'approved', 'in_review'].includes(
    getAvailabilityStepStatus(availability)
  );
  const documentsReady = ['completed', 'approved', 'in_review'].includes(
    getDocumentsStepStatus(documents)
  );

  const canSubmit = useMemo(() => {
    const requiredStatuses = steps
      .filter((step) => step.key !== 'final_submission')
      .every((step) => ['completed', 'approved', 'in_review'].includes(step.status));

    return requiredStatuses && servicesReady && availabilityReady && documentsReady;
  }, [steps, servicesReady, availabilityReady, documentsReady]);

  const runBusy = async (task: () => Promise<void>) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      await task();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={heroCard}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: colors.text }}>Completa onboarding professionista</div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 8, maxWidth: 560 }}>
            Finché il tuo account non viene approvato, la dashboard operativa resta bloccata.
            Completa i passaggi, carica i documenti e invia tutto in revisione.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button style={ghostButton} onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={progressCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Stato onboarding</div>
            <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>{progress}% completato</div>
          </div>
          <span style={{ ...badge, ...statusStyle[steps[steps.length - 1]?.status ?? 'todo'] }}>
            {profile.professional_status === 'submitted'
              ? 'In revisione'
              : profile.professional_status === 'approved'
              ? 'Approvato'
              : 'Bozza'}
          </span>
        </div>
        <div style={progressBarWrap}>
          <div style={{ ...progressBarFill, width: `${progress}%` }} />
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Timeline onboarding</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {steps.map((step) => (
            <div key={step.key} style={stepRow}>
              <div>
                <div style={{ fontWeight: 800 }}>{step.order}. {step.title}</div>
                <div style={mutedText}>{step.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ ...badge, ...statusStyle[step.status] }}>{statusLabel[step.status]}</span>
                {step.key !== 'final_submission' && (
                  <button
                    style={ghostButton}
                    onClick={() => {
                      const editorKey: EditorKey =
                        step.key === 'base_profile'
                          ? 'base'
                          : step.key === 'fiscal_data'
                          ? 'fiscal'
                          : step.key === 'services'
                          ? 'services'
                          : step.key === 'availability'
                          ? 'availability'
                          : 'documents';
                      setEditor(editorKey);
                    }}
                  >
                    Apri
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={tabRow}>
        {[
          { key: 'base', label: 'Profilo base' },
          { key: 'fiscal', label: 'Dati fiscali' },
          { key: 'services', label: 'Servizi' },
          { key: 'availability', label: 'Disponibilità' },
          { key: 'documents', label: 'Documenti' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setEditor(item.key as EditorKey)}
            style={{
              ...tabButton,
              background: editor === item.key ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)' : '#fff',
              color: editor === item.key ? '#fff' : colors.text,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {editor === 'base' && (
        <div style={card}>
          <div style={sectionTitle}>Step 1 · Profilo base</div>
          <div style={grid2}>
            <Input label="Nome" value={baseForm.nome ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, nome: value }))} />
            <Input label="Cognome" value={baseForm.cognome ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, cognome: value }))} />
            <Input label="Telefono" value={baseForm.telefono ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, telefono: value }))} />
            <Input label="Città" value={baseForm.citta ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, citta: value }))} />
            <Input label="Indirizzo" value={baseForm.indirizzo ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, indirizzo: value }))} />
          </div>
          <TextArea label="Bio" value={baseForm.bio ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, bio: value }))} />
          <button style={primaryButton} disabled={isBusy} onClick={() => runBusy(() => onSaveBaseProfile(baseForm))}>Salva profilo base</button>
        </div>
      )}

      {editor === 'fiscal' && (
        <div style={card}>
          <div style={sectionTitle}>Step 2 · Dati fiscali</div>
          <div style={grid2}>
            <SelectField
              label="Tipo documento fiscale"
              value={fiscalForm.tipoDocumentoFiscale ?? 'piva'}
              onChange={(value) =>
                setFiscalForm((prev) => ({
                  ...prev,
                  tipoDocumentoFiscale: value,
                  has_vat: value === 'piva',
                }))
              }
              options={[
                { value: 'piva', label: 'Partita IVA' },
                { value: 'cf', label: 'Codice Fiscale' },
              ]}
            />
            <Input label="Valore documento fiscale" value={fiscalForm.valoreDocumentoFiscale ?? ''} onChange={(value) => setFiscalForm((prev) => ({ ...prev, valoreDocumentoFiscale: value }))} />
            <Input label="Intestatario fatturazione" value={fiscalForm.intestatarioFatturazione ?? ''} onChange={(value) => setFiscalForm((prev) => ({ ...prev, intestatarioFatturazione: value }))} />
            <Input label="Partita IVA" value={fiscalForm.partitaIvaFatturazione ?? ''} onChange={(value) => setFiscalForm((prev) => ({ ...prev, partitaIvaFatturazione: value }))} />
            <Input label="PEC" value={fiscalForm.pec ?? ''} onChange={(value) => setFiscalForm((prev) => ({ ...prev, pec: value }))} />
            <Input label="Codice destinatario" value={fiscalForm.codiceDestinatario ?? ''} onChange={(value) => setFiscalForm((prev) => ({ ...prev, codiceDestinatario: value }))} />
          </div>
          <button style={primaryButton} disabled={isBusy} onClick={() => runBusy(() => onSaveFiscalData(fiscalForm))}>Salva dati fiscali</button>
        </div>
      )}

      {editor === 'services' && <ServicesStep professionalId={professionalId} onChange={setServices} />}
      {editor === 'availability' && <AvailabilityStep professionalId={professionalId} onChange={setAvailability} />}
      {editor === 'documents' && <DocumentsStep professionalId={professionalId} onChange={setDocuments} />}

      <div style={card}>
        <div style={sectionTitle}>Step 6 · Invio finale</div>
        <div style={mutedText}>
          Quando tutti gli step risultano compilati o in revisione, puoi inviare l'onboarding.
        </div>
        <button style={primaryButton} disabled={!canSubmit || isBusy} onClick={() => runBusy(onSubmitOnboarding)}>
          Invia onboarding
        </button>
      </div>

      <BottomNav current={currentTab} onChange={onChangeTab} />
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string; }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void; }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} style={{ ...inputStyle, minHeight: 110, padding: 12 }} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

const pageStyle: CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  padding: '24px 20px 12px',
  display: 'grid',
  gap: 16,
};

const card: CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  display: 'grid',
  gap: 14,
};

const heroCard: CSSProperties = {
  ...card,
  gridTemplateColumns: '1fr auto',
  alignItems: 'start',
};

const progressCard: CSSProperties = { ...card, gap: 12 };

const progressBarWrap: CSSProperties = {
  width: '100%',
  height: 12,
  borderRadius: 999,
  background: '#F3E8E2',
  overflow: 'hidden',
};

const progressBarFill: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
};

const badge: CSSProperties = {
  borderRadius: 999,
  padding: '6px 10px',
  fontSize: 12,
  fontWeight: 800,
};

const stepRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  borderRadius: 18,
  border: '1px solid #F1E4D8',
  padding: 14,
};

const tabRow: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' };
const tabButton: CSSProperties = { border: 'none', borderRadius: 999, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' };
const sectionTitle: CSSProperties = { fontSize: 18, fontWeight: 800, color: colors.text };
const grid2: CSSProperties = { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' };
const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 700, color: colors.text };
const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 16, border: '1px solid #E7D9CD', padding: '0 14px', boxSizing: 'border-box', fontSize: 14, background: '#fff' };
const primaryButton: CSSProperties = { border: 'none', borderRadius: 16, padding: '14px 18px', background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)', color: '#fff', fontWeight: 800, cursor: 'pointer' };
const ghostButton: CSSProperties = { border: '1px solid #E7D9CD', borderRadius: 16, padding: '12px 16px', background: '#fff', color: colors.text, fontWeight: 700, cursor: 'pointer' };
const mutedText: CSSProperties = { color: '#6B7280', fontSize: 14 };
