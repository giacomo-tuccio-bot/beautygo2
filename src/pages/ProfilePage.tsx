import React from 'react';

export default function ProfilePage({
  onGoLogin,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
}: {
  onGoLogin: () => void;
  onGoRegisterCustomer: () => void;
  onGoRegisterProfessional: () => void;
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
      <h1 style={{ textAlign: 'center' }}>Profilo</h1>

      <p style={{ textAlign: 'center', marginBottom: 20 }}>
        Accedi oppure registrati come cliente o professionista.
      </p>

      {/* LOGIN */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Accesso</h3>

        <button onClick={onGoLogin} style={primaryButton}>
          Accedi
        </button>
      </div>

      {/* CLIENTE */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Cliente</h3>

        <button onClick={onGoRegisterCustomer} style={secondaryButton}>
          Registrati come cliente
        </button>
      </div>

      {/* PROFESSIONISTA */}
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center' }}>Professionista</h3>

        <button onClick={onGoRegisterProfessional} style={primaryButton}>
          Registrati come professionista
        </button>
      </div>
    </div>
  );
}
