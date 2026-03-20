import React from 'react';
import { colors } from '../theme';

export default function ServiceProfessionalsPage({
  selectedServices,
  onBack,
  onOpenProfessional,
  onGoBookings,
}: {
  selectedServices: string[];
  onBack: () => void;
  onOpenProfessional: (id: string) => void;
  onGoBookings: () => void;
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
      <h1 style={{ textAlign: 'center', fontWeight: 800 }}>
        Professionisti disponibili
      </h1>

      <div style={{ marginTop: 20 }}>
        {selectedServices.length === 0 ? (
          <div style={{ textAlign: 'center', color: colors.muted }}>
            Nessun servizio selezionato
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedServices.map((s) => (
              <div
                key={s}
                style={{
                  background: '#FFF3E8',
                  padding: '8px 12px',
                  borderRadius: 999,
                  fontWeight: 700,
                  color: '#FF6A00',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => onOpenProfessional('sofia-martini')}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 18,
            border: 'none',
            background: '#fff',
            boxShadow: colors.shadow,
            cursor: 'pointer',
          }}
        >
          Sofia Martini - Milano
        </button>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 360,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 16,
            border: 'none',
            background: '#FFF3E8',
            color: '#FF6A00',
            fontWeight: 800,
          }}
        >
          ← Indietro
        </button>
      </div>
    </div>
  );
}