import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BottomNav from '../components/BottomNav';
import { colors } from '../theme';
import {
  buildOnboardingSteps,
  getProgressPercent,
  isAvailabilityCompleted,
  isBaseProfileCompleted,
  isFiscalDataCompleted,
  isValidService,
  type AvailabilityRecord,
  type OnboardingStep,
  type ProfileForOnboarding,
  type ServiceRecord,
} from '../lib/onboarding';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';
type EditorKey = 'base' | 'fiscal' | 'services' | 'availability';

type ProfileForm = ProfileForOnboarding & {
  email?: string | null;
  ragioneSociale?: string | null;
  indirizzoFatturazione?: string | null;
  cittaFatturazione?: string | null;
  capFatturazione?: string | null;
  provinciaFatturazione?: string | null;
};

type CatalogService = {
  id: string;
  name: string;
  category: string | null;
  default_duration: number | null;
};

type ServiceDraft = {
  catalog_id: string;
  description: string;
  duration_minutes: string;
  price: string;
};

type DayConfig = {
  weekday: number;
  label: string;
  enabled: boolean;
  slots: Array<{ start_time: string; end_time: string }>;
};

const weekdayMeta: Array<{ weekday: number; label: string }> = [
  { weekday: 1, label: 'Lunedì' },
  { weekday: 2, label: 'Martedì' },
  { weekday: 3, label: 'Mercoledì' },
  { weekday: 4, label: 'Giovedì' },
  { weekday: 5, label: 'Venerdì' },
  { weekday: 6, label: 'Sabato' },
  { weekday: 7, label: 'Domenica' },
];

const emptyServiceDraft: ServiceDraft = {
  catalog_id: '',
  description: '',
  duration_minutes: '60',
  price: '',
};


const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const minutes = index * 15;
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
});

const durationOptions = Array.from({ length: 24 }, (_, index) => String((index + 1) * 10));

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

function buildAvailabilityDraft(availability: AvailabilityRecord[]): DayConfig[] {
  return weekdayMeta.map(({ weekday, label }) => {
    const daySlots = availability
      .filter((slot) => slot.weekday === weekday && slot.is_active)
      .map((slot) => ({ start_time: slot.start_time.slice(0, 5), end_time: slot.end_time.slice(0, 5) }));

    return {
      weekday,
      label,
      enabled: daySlots.length > 0,
      slots: daySlots.length > 0 ? daySlots : [{ start_time: '09:00', end_time: '18:00' }],
    };
  });
}

export default function ProfessionalOnboardingDashboard({
  currentTab,
  onChangeTab,
  profile,
  services,
  availability,
  serviceCatalog,
  onSaveBaseProfile,
  onSaveFiscalData,
  onCreateService,
  onDeleteService,
  onSubmitServices,
  onSaveAvailability,
  onSubmitOnboarding,
  onLogout,
}: {
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  profile: ProfileForm;
  services: ServiceRecord[];
  availability: AvailabilityRecord[];
  serviceCatalog: CatalogService[];
  onSaveBaseProfile: (payload: ProfileForm) => Promise<void>;
  onSaveFiscalData: (payload: ProfileForm) => Promise<void>;
  onCreateService: (payload: ServiceDraft) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  onSubmitServices: () => Promise<void>;
  onSaveAvailability: (days: DayConfig[]) => Promise<void>;
  onSubmitOnboarding: () => Promise<void>;
  onLogout: () => void;
}) {
  const [editor, setEditor] = useState<EditorKey>('base');
  const [baseForm, setBaseForm] = useState<ProfileForm>(profile);
  const [fiscalForm, setFiscalForm] = useState<ProfileForm>(profile);
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>(emptyServiceDraft);
  const [availabilityDraft, setAvailabilityDraft] = useState<DayConfig[]>(buildAvailabilityDraft(availability));
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setBaseForm(profile);
    setFiscalForm(profile);
  }, [profile]);

  useEffect(() => {
    setAvailabilityDraft(buildAvailabilityDraft(availability));
  }, [availability]);

  const steps = useMemo(() => buildOnboardingSteps(profile, services, availability), [profile, services, availability]);
  const progress = useMemo(() => getProgressPercent(steps), [steps]);
  const canSubmit = useMemo(
    () =>
      isBaseProfileCompleted(profile) &&
      isFiscalDataCompleted(profile) &&
      services.some(isValidService) &&
      isAvailabilityCompleted(availability),
    [profile, services, availability]
  );

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
    <div style={{ minHeight: '100vh', background: '#F7F1EE', paddingBottom: 92 }}>
      <div style={pageStyle}>
        <div style={heroCard}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6A00', textTransform: 'uppercase' }}>
              Onboarding professionista
            </div>
            <h1 style={{ margin: '8px 0 4px', fontSize: 28, lineHeight: 1.1, color: colors.text }}>
              Completa i passaggi per attivare il tuo profilo
            </h1>
            <div style={{ color: '#6B7280', fontSize: 14 }}>
              Finché il profilo non viene approvato, la dashboard operativa resta bloccata.
            </div>
          </div>
          <button onClick={onLogout} style={ghostButton}>Logout</button>
        </div>

        <div style={progressCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Avanzamento onboarding</div>
              <div style={{ color: '#6B7280', fontSize: 14 }}>Stato reale letto da profilo, servizi e disponibilità.</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 26 }}>{progress}%</div>
          </div>
          <div style={progressBarWrap}>
            <div style={{ ...progressBarFill, width: `${progress}%` }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {steps.map((step) => (
            <div key={step.key} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, color: colors.text }}>{step.order}. {step.title}</div>
                  <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{step.description}</div>
                </div>
                <span style={{ ...badge, ...statusStyle[step.status] }}>{statusLabel[step.status]}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={tabRow}>
          {[
            { key: 'base', label: 'Step 1' },
            { key: 'fiscal', label: 'Step 2' },
            { key: 'services', label: 'Step 3' },
            { key: 'availability', label: 'Step 4' },
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
            <div style={{ marginTop: 14 }}>
              <TextArea label="Bio" value={baseForm.bio ?? ''} onChange={(value) => setBaseForm((prev) => ({ ...prev, bio: value }))} />
            </div>
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
                onChange={(value) => setFiscalForm((prev) => ({
                  ...prev,
                  tipoDocumentoFiscale: value,
                  has_vat: value === 'piva',
                }))}
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

        {editor === 'services' && (
          <div style={card}>
            <div style={sectionTitle}>Step 3 · Servizi</div>
            <div style={grid2}>
              <SelectField
                label="Servizio da catalogo"
                value={serviceDraft.catalog_id}
                onChange={(value) => {
                  const selected = serviceCatalog.find((item) => item.id === value);
                  setServiceDraft((prev) => ({
                    ...prev,
                    catalog_id: value,
                    duration_minutes: String(selected?.default_duration ?? 60),
                  }));
                }}
                options={[
                  { value: '', label: 'Seleziona servizio' },
                  ...serviceCatalog.map((item) => ({
                    value: item.id,
                    label: item.category ? `${item.category} · ${item.name}` : item.name,
                  })),
                ]}
              />
              <SelectField
                label="Durata (min)"
                value={serviceDraft.duration_minutes}
                onChange={(value) => setServiceDraft((prev) => ({ ...prev, duration_minutes: value }))}
                options={durationOptions.map((minutes) => ({ value: minutes, label: `${minutes} min` }))}
              />
              <Input label="Prezzo (€)" type="number" value={serviceDraft.price} onChange={(value) => setServiceDraft((prev) => ({ ...prev, price: value }))} />
            </div>
            <div style={{ marginTop: 14 }}>
              <TextArea label="Descrizione" value={serviceDraft.description} onChange={(value) => setServiceDraft((prev) => ({ ...prev, description: value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                style={primaryButton}
                disabled={isBusy || !serviceDraft.catalog_id || !serviceDraft.price}
                onClick={() =>
                  runBusy(async () => {
                    await onCreateService(serviceDraft);
                    setServiceDraft(emptyServiceDraft);
                  })
                }
              >
                Aggiungi servizio
              </button>
              <button style={secondaryButton} disabled={isBusy || !services.some(isValidService)} onClick={() => runBusy(onSubmitServices)}>
                Invia servizi in revisione
              </button>
            </div>
            <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
              {services.length === 0 ? (
                <div style={mutedText}>Nessun servizio inserito.</div>
              ) : (
                services.map((service) => (
                  <div key={service.id} style={serviceCard}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{service.name}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                        {service.duration_minutes ?? '-'} min · € {service.price ?? '-'}
                        {service.category ? ` · ${service.category}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ ...badge, ...statusStyle[service.status === 'pending' ? 'in_review' : service.status === 'approved' ? 'approved' : service.status === 'rejected' ? 'rejected' : 'completed'] }}>
                        {service.status ?? 'draft'}
                      </span>
                      <button style={dangerButton} disabled={isBusy} onClick={() => runBusy(() => onDeleteService(service.id))}>Elimina</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {editor === 'availability' && (
          <div style={card}>
            <div style={sectionTitle}>Step 4 · Disponibilità</div>
            <div style={{ display: 'grid', gap: 14 }}>
              {availabilityDraft.map((day, dayIndex) => (
                <div key={day.weekday} style={dayCard}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(event) =>
                        setAvailabilityDraft((prev) => prev.map((item, index) => index === dayIndex ? { ...item, enabled: event.target.checked } : item))
                      }
                    />
                    {day.label}
                  </label>
                  {day.enabled && (
                    <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                      {day.slots.map((slot, slotIndex) => (
                        <div key={`${day.weekday}-${slotIndex}`} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <select value={slot.start_time} onChange={(event) => setAvailabilityDraft((prev) => prev.map((item, index) => index === dayIndex ? { ...item, slots: item.slots.map((currentSlot, currentIndex) => currentIndex === slotIndex ? { ...currentSlot, start_time: event.target.value } : currentSlot) } : item))} style={timeInput}>
                            {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                          <span style={{ color: '#6B7280' }}>→</span>
                          <select value={slot.end_time} onChange={(event) => setAvailabilityDraft((prev) => prev.map((item, index) => index === dayIndex ? { ...item, slots: item.slots.map((currentSlot, currentIndex) => currentIndex === slotIndex ? { ...currentSlot, end_time: event.target.value } : currentSlot) } : item))} style={timeInput}>
                            {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                          <button type="button" style={dangerButton} onClick={() => setAvailabilityDraft((prev) => prev.map((item, index) => index === dayIndex ? { ...item, slots: item.slots.length > 1 ? item.slots.filter((_, currentIndex) => currentIndex !== slotIndex) : item.slots } : item))}>Rimuovi fascia</button>
                        </div>
                      ))}
                      <button type="button" style={secondaryButton} onClick={() => setAvailabilityDraft((prev) => prev.map((item, index) => index === dayIndex ? { ...item, slots: [...item.slots, { start_time: '09:00', end_time: '13:00' }] } : item))}>Aggiungi fascia oraria</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button style={primaryButton} disabled={isBusy} onClick={() => runBusy(() => onSaveAvailability(availabilityDraft))}>Salva disponibilità</button>
          </div>
        )}

        <div style={card}>
          <div style={sectionTitle}>Invio finale</div>
          <div style={{ color: '#6B7280', fontSize: 14, marginBottom: 12 }}>
            Quando i primi 4 step sono completi, puoi inviare l'onboarding. Lo stato globale diventa <strong>submitted</strong>.
          </div>
          <button style={primaryButton} disabled={!canSubmit || isBusy} onClick={() => runBusy(onSubmitOnboarding)}>
            Invia onboarding
          </button>
        </div>
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

const progressCard: CSSProperties = {
  ...card,
  gap: 12,
};

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

const tabRow: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const tabButton: CSSProperties = {
  border: 'none',
  borderRadius: 999,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const sectionTitle: CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: colors.text,
};

const grid2: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: colors.text,
};

const inputStyle: CSSProperties = {
  width: '100%',
  minHeight: 48,
  borderRadius: 16,
  border: '1px solid #E7D9CD',
  padding: '0 14px',
  boxSizing: 'border-box',
  fontSize: 14,
  background: '#fff',
};

const primaryButton: CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryButton: CSSProperties = {
  border: '1px solid #F1D7C4',
  borderRadius: 16,
  padding: '14px 18px',
  background: '#FFF3E8',
  color: '#D35400',
  fontWeight: 800,
  cursor: 'pointer',
};

const ghostButton: CSSProperties = {
  border: '1px solid #E7D9CD',
  borderRadius: 16,
  padding: '12px 16px',
  background: '#fff',
  color: colors.text,
  fontWeight: 700,
  cursor: 'pointer',
};

const dangerButton: CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: '10px 12px',
  background: '#FEE2E2',
  color: '#B91C1C',
  fontWeight: 700,
  cursor: 'pointer',
};

const mutedText: CSSProperties = {
  color: '#6B7280',
  fontSize: 14,
};

const serviceCard: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'center',
  borderRadius: 18,
  border: '1px solid #F1E4D8',
  padding: 14,
};

const dayCard: CSSProperties = {
  borderRadius: 18,
  border: '1px solid #F1E4D8',
  padding: 14,
};

const timeInput: CSSProperties = {
  minHeight: 42,
  borderRadius: 12,
  border: '1px solid #E7D9CD',
  padding: '0 12px',
};
