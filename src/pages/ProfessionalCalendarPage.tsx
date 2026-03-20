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

export default function ProfessionalCalendarPage({
  professionalAvailability,
  requests,
  onBack,
}: {
  professionalAvailability: AvailabilityDay[];
  requests: ProfessionalRequest[];
  onBack: () => void;
}) {
  const activeDays = professionalAvailability.filter((day) => day.enabled);
  const acceptedRequests = requests.filter((request) => request.status === 'accepted');

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
        Calendario personale
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
        Qui trovi il riepilogo dei giorni disponibili e degli appuntamenti accettati.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        <div style={card}>
          <div style={sectionTitle}>Disponibilità attiva</div>

          {activeDays.length === 0 ? (
            <div style={mutedText}>
              Nessuna disponibilità attiva. Vai nella sezione “Disponibilità” per impostare i tuoi giorni lavorativi.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {activeDays.map((day) => (
                <div key={day.key} style={dayRow}>
                  <div style={dayLabel}>{day.label}</div>
                  <div style={dayTime}>
                    {day.slots.map((slot) => `${slot.startTime} - ${slot.endTime}`).join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <div style={sectionTitle}>Appuntamenti accettati</div>

          {acceptedRequests.length === 0 ? (
            <div style={mutedText}>
              Nessun appuntamento confermato al momento.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {acceptedRequests.map((request) => (
                <div key={request.id} style={appointmentCard}>
                  <div style={appointmentTitle}>{request.serviceName}</div>
                  <div style={appointmentText}>
                    <strong>Cliente:</strong> {request.customerName}
                  </div>
                  <div style={appointmentText}>
                    <strong>Data:</strong> {request.dateLabel}
                  </div>
                  <div style={appointmentText}>
                    <strong>Orario:</strong> {request.timeLabel}
                  </div>
                  <div style={appointmentText}>
                    <strong>Luogo:</strong> {request.location}
                  </div>
                  <div style={acceptedBadge}>Confermato</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomSingleButton
        label="← Torna alla dashboard"
        onClick={onBack}
      />
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

const dayRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  background: '#FFFDFC',
  border: '1px solid #F3E7DE',
  borderRadius: 18,
  padding: '14px 16px',
};

const dayLabel: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 15,
};

const dayTime: React.CSSProperties = {
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 14,
};

const appointmentCard: React.CSSProperties = {
  background: '#FFFDFC',
  borderRadius: 20,
  padding: 16,
  border: '1px solid #F3E7DE',
};

const appointmentTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 17,
  lineHeight: 1.4,
  marginBottom: 8,
};

const appointmentText: React.CSSProperties = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.7,
};

const acceptedBadge: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 12,
  borderRadius: 999,
  padding: '6px 12px',
  background: '#EAF8EF',
  color: '#228B4E',
  fontSize: 12,
  fontWeight: 800,
};