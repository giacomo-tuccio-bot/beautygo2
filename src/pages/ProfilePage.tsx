import React from 'react';

export default function ProfilePage({
  onGoLogin,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
  onBackToHome,
}: {
  onGoLogin: () => void;
  onGoRegisterCustomer: () => void;
  onGoRegisterProfessional: () => void;
  onBackToHome: () => void;
}) {
  const cardStyle: React.CSSProperties = {
    background: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  };

  const primaryButton: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: '#ff7a00',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  };

  const secondaryButton: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: '#e9ded6',
    color: '#ff7a00',
    fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: 16 }}>

      {/* 🔙 BACK BUTTON */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={onBackToHome}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ← Indietro
        </button>
      </div>

      <h1 style={{ textAlign: 'center' }}>Profilo</h1>
      <p style={{ textAlign: 'center', marginBottom: 20 }}>
        Accedi con un solo account oppure scegli una registrazione dedicata come cliente o professionista.
      </p>

      {/* LOGIN */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Accesso unico</h3>
        <p style={{ textAlign: 'center', marginBottom: 16 }}>
          Clienti e professionisti accedono dalla stessa pagina. Dopo il login il sistema riconosce il profilo.
        </p>

        <button onClick={onGoLogin} style={primaryButton}>
          Accedi
        </button>
      </div>

      {/* CLIENTE */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Registrazione cliente</h3>
        <p style={{ textAlign: 'center', marginBottom: 16 }}>
          Crea il tuo profilo cliente per prenotare servizi e gestire appuntamenti.
        </p>

        <button onClick={onGoRegisterCustomer} style={secondaryButton}>
          Registrati come cliente
        </button>
      </div>

      {/* PROFESSIONISTA */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Registrazione professionista</h3>
        <p style={{ textAlign: 'center', marginBottom: 16 }}>
          Registrati come professionista e completa l’onboarding dopo il login.
        </p>

        <button onClick={onGoRegisterProfessional} style={primaryButton}>
          Registrati come professionista
        </button>
      </div>
    </div>
  );
}
