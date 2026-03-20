import React from 'react';
import { colors } from '../theme';

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

export default function ProfessionalContractsPage({
  professionalContract,
  contractsUnlocked,
  onSendOtp,
  onMarkSigned,
  onBack,
}: {
  professionalContract: ProfessionalContract;
  contractsUnlocked: boolean;
  onSendOtp: () => void;
  onMarkSigned: () => void;
  onBack: () => void;
}) {
  const contractLabel =
    professionalContract.contractType === 'vat'
      ? 'Contratto Professionista - Partita IVA'
      : 'Contratto Professionista - Codice Fiscale';

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
        Contratti firmati
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
        Il contratto viene predisposto dal backoffice e poi reso disponibile alla firma digitale tramite OTP via SMS.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
        <div style={card}>
          <div style={sectionTitle}>Tipo contratto</div>
          <div style={contractTitle}>{contractLabel}</div>
          <div style={badgeStyle(professionalContract.status)}>
            {getContractStatusLabel(professionalContract.status)}
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>Stato processo</div>

          {!contractsUnlocked ? (
            <div style={mutedText}>
              Il contratto non è ancora disponibile. Prima devono essere approvati servizi e documenti.
            </div>
          ) : professionalContract.status === 'locked' ? (
            <div style={mutedText}>
              Il contratto non è ancora stato caricato dal backoffice.
            </div>
          ) : (
            <>
              {professionalContract.fileName && (
                <div style={{ marginTop: 10 }}>
                  <div style={infoRow}>
                    <strong>Documento:</strong> {professionalContract.fileName}
                  </div>

                  {professionalContract.uploadedAt && (
                    <div style={infoRow}>
                      <strong>Caricato il:</strong>{' '}
                      {new Date(professionalContract.uploadedAt).toLocaleString('it-IT')}
                    </div>
                  )}

                  {professionalContract.availableAt && (
                    <div style={infoRow}>
                      <strong>Disponibile dal:</strong>{' '}
                      {new Date(professionalContract.availableAt).toLocaleString('it-IT')}
                    </div>
                  )}

                  {professionalContract.signedAt && (
                    <div style={infoRow}>
                      <strong>Firmato il:</strong>{' '}
                      {new Date(professionalContract.signedAt).toLocaleString('it-IT')}
                    </div>
                  )}
                </div>
              )}

              {professionalContract.status === 'uploaded_by_admin' && (
                <div style={{ ...mutedText, marginTop: 14 }}>
                  Il contratto è stato caricato dal backoffice ma non è ancora stato reso disponibile alla firma.
                </div>
              )}

              <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                <button
                  onClick={onSendOtp}
                  disabled={professionalContract.status !== 'ready_for_signature'}
                  style={{
                    ...secondaryButton,
                    background:
                      professionalContract.status === 'ready_for_signature'
                        ? '#FFF3E8'
                        : '#E5E5E5',
                    color:
                      professionalContract.status === 'ready_for_signature'
                        ? '#FF6A00'
                        : '#9A9A9A',
                    cursor:
                      professionalContract.status === 'ready_for_signature'
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  Invia OTP firma
                </button>

                <button
                  onClick={onMarkSigned}
                  disabled={professionalContract.status !== 'ready_for_signature'}
                  style={{
                    ...primaryButton,
                    background:
                      professionalContract.status === 'ready_for_signature'
                        ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                        : '#E5E5E5',
                    color:
                      professionalContract.status === 'ready_for_signature'
                        ? '#fff'
                        : '#9A9A9A',
                    cursor:
                      professionalContract.status === 'ready_for_signature'
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  Completa firma contratto
                </button>
              </div>
            </>
          )}
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

function getContractStatusLabel(status: ContractStatus) {
  switch (status) {
    case 'locked':
      return 'Bloccato';
    case 'uploaded_by_admin':
      return 'Caricato da admin';
    case 'ready_for_signature':
      return 'Pronto alla firma';
    case 'signed':
      return 'Firmato';
    default:
      return status;
  }
}

function badgeStyle(status: ContractStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    marginTop: 12,
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 800,
  };

  switch (status) {
    case 'locked':
      return { ...base, background: '#F1F1F1', color: '#6F6F6F' };
    case 'uploaded_by_admin':
      return { ...base, background: '#FFF8F1', color: '#FF7A00' };
    case 'ready_for_signature':
      return { ...base, background: '#FFF3E8', color: '#FF6A00' };
    case 'signed':
      return { ...base, background: '#EAF8EF', color: '#228B4E' };
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

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: colors.text,
  marginBottom: 12,
};

const contractTitle: React.CSSProperties = {
  color: colors.text,
  fontWeight: 800,
  fontSize: 18,
  lineHeight: 1.4,
};

const mutedText: React.CSSProperties = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const infoRow: React.CSSProperties = {
  color: colors.text,
  fontSize: 14,
  lineHeight: 1.8,
};

const secondaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  fontWeight: 800,
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  fontWeight: 800,
  fontSize: 14,
};