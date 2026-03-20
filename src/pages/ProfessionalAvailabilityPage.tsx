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

type AvailabilityDay = {
  key: AvailabilityDayKey;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export default function ProfessionalAvailabilityPage({
  professionalAvailability,
  availabilitySaved,
  onToggleAvailabilityDay,
  onAvailabilityTimeChange,
  onSaveAvailability,
  onBack,
}: {
  professionalAvailability: AvailabilityDay[];
  availabilitySaved: boolean;
  onToggleAvailabilityDay: (dayKey: AvailabilityDayKey) => void;
  onAvailabilityTimeChange: (
    dayKey: AvailabilityDayKey,
    field: 'startTime' | 'endTime',
    value: string
  ) => void;
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
        Imposta i giorni e le fasce orarie in cui il professionista è disponibile
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
              Seleziona almeno un giorno lavorativo e imposta la fascia oraria.
            </div>
          )}
        </div>

        <div style={card}>
          <div style={sectionTitle}>Giorni e orari</div>

          <div style={noteBox}>
            Le richieste future verranno mostrate in base ai giorni e agli orari qui
            configurati. Puoi aggiornare la disponibilità in qualsiasi momento.
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

                <div style={availabilityTimeGrid}>
                  <div>
                    <div style={timeLabel}>Inizio</div>
                    <input
                      type="time"
                      value={day.startTime}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        onAvailabilityTimeChange(day.key, 'startTime', e.target.value)
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
                      value={day.endTime}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        onAvailabilityTimeChange(day.key, 'endTime', e.target.value)
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
          </div>

          <button
            onClick={onSaveAvailability}
            style={{
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
            }}
          >
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

const mutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
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

const availabilityCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 20,
  padding: 16,
  border: '1px solid #F3E7DE',
};

const availabilityTopRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const toggleDayButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '12px 14px',
  fontWeight: 800,
  fontSize: 14,
  cursor: 'pointer',
};

const availabilityTimeGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginTop: 14,
};

const timeLabel: React.CSSProperties = {
  color: colors.muted,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
};

const timeInput: React.CSSProperties = {
  width: '100%',
  border: '1px solid #ECD9CC',
  borderRadius: 14,
  padding: '12px 14px',
  background: '#fff',
  color: colors.text,
  fontSize: 14,
  fontWeight: 700,
  boxSizing: 'border-box',
};