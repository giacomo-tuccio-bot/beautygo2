import React from 'react';
import { colors } from '../theme';

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

export default function ProfessionalRequestsPage({
  requests,
  onAcceptRequest,
  onRejectRequest,
  onBack,
}: {
  requests: ProfessionalRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onBack: () => void;
}) {
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
        Richieste ricevute
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
        Il professionista deve accettare o rifiutare ogni richiesta entro 10 minuti.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        {requests.length === 0 ? (
          <div style={card}>
            <div style={mutedText}>Nessuna richiesta ricevuta al momento.</div>
          </div>
        ) : (
          requests.map((request) => {
            const isPending = request.status === 'pending';
            const isExpired = request.status === 'expired';

            return (
              <div key={request.id} style={card}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={requestTitle}>{request.serviceName}</div>
                    <div style={requestText}>
                      <strong>Cliente:</strong> {request.customerName}
                    </div>
                    <div style={requestText}>
                      <strong>Data:</strong> {request.dateLabel}
                    </div>
                    <div style={requestText}>
                      <strong>Orario:</strong> {request.timeLabel}
                    </div>
                    <div style={requestText}>
                      <strong>Luogo:</strong> {request.location}
                    </div>
                  </div>

                  <div style={getStatusBadgeStyle(request.status)}>
                    {getStatusLabel(request.status)}
                  </div>
                </div>

                {isPending && (
                  <div style={{ marginTop: 14 }}>
                    <div style={timerBox}>
                      Tempo residuo: {request.minutesLeft} min
                    </div>
                  </div>
                )}

                {isExpired && (
                  <div style={{ ...mutedText, marginTop: 14 }}>
                    La richiesta è scaduta automaticamente perché non gestita entro i 10 minuti.
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => onAcceptRequest(request.id)}
                    disabled={!isPending}
                    style={{
                      ...actionButton,
                      background: isPending ? '#EAF8EF' : '#E5E5E5',
                      color: isPending ? '#228B4E' : '#9A9A9A',
                      cursor: isPending ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Accetta
                  </button>

                  <button
                    onClick={() => onRejectRequest(request.id)}
                    disabled={!isPending}
                    style={{
                      ...actionButton,
                      background: isPending ? '#FDECEC' : '#E5E5E5',
                      color: isPending ? '#C53B3B' : '#9A9A9A',
                      cursor: isPending ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Rifiuta
                  </button>
                </div>
              </div>
            );
          })
        )}
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

function getStatusLabel(status: RequestStatus) {
  switch (status) {
    case 'pending':
      return 'Da gestire';
    case 'accepted':
      return 'Accettata';
    case 'rejected':
      return 'Rifiutata';
    case 'expired':
      return 'Scaduta';
    default:
      return status;
  }
}

function getStatusBadgeStyle(status: RequestStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  switch (status) {
    case 'pending':
      return {
        ...base,
        background: '#FFF8F1',
        color: '#FF7A00',
      };
    case 'accepted':
      return {
        ...base,
        background: '#EAF8EF',
        color: '#228B4E',
      };
    case 'rejected':
      return {
        ...base,
        background: '#FDECEC',
        color: '#C53B3B',
      };
    case 'expired':
      return {
        ...base,
        background: '#F1F1F1',
        color: '#6F6F6F',
      };
    default:
      return base;
  }
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 18,
  boxShadow: colors.shadow,
};

const requestTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 18,
  lineHeight: 1.4,
  marginBottom: 8,
};

const requestText: React.CSSProperties = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.7,
};

const mutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const timerBox: React.CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: '#FFF8F1',
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 13,
};

const actionButton: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 16,
  padding: '13px 14px',
  fontWeight: 800,
  fontSize: 14,
};