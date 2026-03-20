import React from 'react';
import { colors } from '../theme';

type AvailabilityDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type AvailabilityDay = {
  key: AvailabilityDayKey;
  label: string;
  enabled: boolean;
  slots: AvailabilitySlot[];
};

export default function ProfessionalAvailabilityPage({
  professionalAvailability,
  availabilitySaved,
  onToggleAvailabilityDay,
  onAvailabilityTimeChange,
  onAddAvailabilitySlot,
  onRemoveAvailabilitySlot,
  onSaveAvailability,
  onBack,
}: {
  professionalAvailability: AvailabilityDay[];
  availabilitySaved: boolean;
  onToggleAvailabilityDay: (dayKey: AvailabilityDayKey) => void;
  onAvailabilityTimeChange: (
    dayKey: AvailabilityDayKey,
    slotId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => void;
  onAddAvailabilitySlot: (dayKey: AvailabilityDayKey) => void;
  onRemoveAvailabilitySlot: (dayKey: AvailabilityDayKey, slotId: string) => void;
  onSaveAvailability: () => void;
  onBack: () => void;
}) {
  const enabledDays = professionalAvailability.filter((day) => day.enabled);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 120px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        Disponibilità lavorativa
      </h1>

      <p
        style={{
          color: colors.muted,
          marginTop: 8,
          textAlign: 'center',
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        Imposta i giorni e fino a 3 fasce orarie in cui il professionista è disponibile
        a ricevere richieste.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        <div style={card}>
          <div style={sectionTitle}>Stato disponibilità</div>

          {availabilitySaved ? (
            <div style={successBox}>
              Disponibilità salvata con {enabledDays.length} giorno/i attivo/i
            </div>
          ) : enabledDays.length > 0 ? (
            <div style={statusBox}>Hai modifiche non ancora salvate</div>
          ) : (
            <div style={mutedText}>
              Seleziona almeno un giorno lavorativo e imposta almeno una fascia oraria.
            </div>
          )}
        </div>

        <div style={card}>
          <div style={sectionTitle}>Giorni e orari</div>

          <div style={noteBox}>
            Puoi impostare fino a 3 fasce orarie per ogni giorno, ad esempio 09:00-13:00,
            14:00-16:00 e 20:00-21:00. Le fasce non devono sovrapporsi.
          </div>

          <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
            {professionalAvailability.map((day) => (
              <div key={day.key} style={availabilityCard}>
                <div style={availabilityTopRow}>
                  <button
                    onClick={() => onToggleAvailabilityDay(day.key)}
                    style={{
                      ...toggleDayButton,
                      background: day.enabled
                        ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                        : '#FFF3E8',
                      color: day.enabled ? '#fff' : '#FF6A00',
                    }}
                  >
                    {day.enabled ? '✓ ' : ''}
                    {day.label}
                  </button>

                  <div style={dayStatusPill(day.enabled)}>
                    {day.enabled ? 'Attivo' : 'Non attivo'}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                  {day.slots.map((slot, index) => (
                    <div key={slot.id} style={slotCard(day.enabled)}>
                      <div style={slotHeader}>
                        <div style={slotTitle}>Fascia {index + 1}</div>

                        <button
                          onClick={() => onRemoveAvailabilitySlot(day.key, slot.id)}
                          disabled={!day.enabled || day.slots.length === 1}
                          style={{
                            ...slotActionButton,
                            opacity: !day.enabled || day.slots.length === 1 ? 0.5 : 1,
                            cursor:
                              !day.enabled || day.slots.length === 1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Rimuovi
                        </button>
                      </div>

                      <div style={availabilityTimeGrid}>
                        <div>
                          <div style={timeLabel}>Inizio</div>
                          <input
                            type="time"
                            value={slot.startTime}
                            disabled={!day.enabled}
                            onChange={(e) =>
                              onAvailabilityTimeChange(
                                day.key,
                                slot.id,
                                'startTime',
                                e.target.value
                              )
                            }
                            style={{
                              ...timeInput,
                              opacity: day.enabled ? 1 : 0.6,
                              cursor: day.enabled ? 'pointer' : 'not-allowed',
                            }}
                          />
                        </div>

                        <div>
                          <div style={timeLabel}>Fine</div>
                          <input
                            type="time"
                            value={slot.endTime}
                            disabled={!day.enabled}
                            onChange={(e) =>
                              onAvailabilityTimeChange(
                                day.key,
                                slot.id,
                                'endTime',
                                e.target.value
                              )
                            }
                            style={{
                              ...timeInput,
                              opacity: day.enabled ? 1 : 0.6,
                              cursor: day.enabled ? 'pointer' : 'not-allowed',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => onAddAvailabilitySlot(day.key)}
                    disabled={!day.enabled || day.slots.length >= 3}
                    style={{
                      ...secondaryButton,
                      opacity: !day.enabled || day.slots.length >= 3 ? 0.5 : 1,
                      cursor: !day.enabled || day.slots.length >= 3 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    + Aggiungi fascia oraria
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={onSaveAvailability} style={primaryButton}>
            Salva disponibilità
          </button>
        </div>
      </div>

      <BottomSingleButton label="← Torna alla dashboard" onClick={onBack} />
    </div>
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

function dayStatusPill(enabled: boolean): React.CSSProperties {
  return {
    display: 'inline-block',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
    background: enabled ? '#EAF8EF' : '#F1F1F1',
    color: enabled ? '#228B4E' : '#6F6F6F',
  };
}

function slotCard(enabled: boolean): React.CSSProperties {
  return {
    background: enabled ? '#FFF8F1' : '#F7F7F7',
    borderRadius: 18,
    padding: 14,
    border: '1px solid #F1E5DA',
  };
}

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

const successBox: React.CSSProperties = {
  borderRadius: 16,
  padding: '14px 16px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 14,
  fontWeight: 700,
};

const statusBox: React.CSSProperties = {
  borderRadius: 16,
  padding: '14px 16px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontSize: 14,
  fontWeight: 700,
};

const mutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const noteBox: React.CSSProperties = {
  borderRadius: 18,
  padding: '14px 16px',
  background: '#FFF8F1',
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const availabilityCard: React.CSSProperties = {
  borderRadius: 22,
  padding: 16,
  background: '#fff',
  border: '1px solid #F2E6DB',
  boxShadow: '0 10px 24px rgba(0,0,0,0.04)',
};

const availabilityTopRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
};

const toggleDayButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '12px 16px',
  fontSize: 15,
  fontWeight: 800,
  cursor: 'pointer',
};

const availabilityTimeGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const timeLabel: React.CSSProperties = {
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 700,
  color: colors.text,
};

const timeInput: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: '1px solid #E8D7CA',
  padding: '12px 14px',
  fontSize: 15,
  color: colors.text,
  background: '#fff',
  boxSizing: 'border-box',
};

const primaryButton: React.CSSProperties = {
  width: '100%',
  marginTop: 18,
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
};

const secondaryButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  borderRadius: 16,
  padding: '13px 16px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 14,
};

const slotHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
};

const slotTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: colors.text,
};

const slotActionButton: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#FF6A00',
  fontSize: 13,
  fontWeight: 800,
};
