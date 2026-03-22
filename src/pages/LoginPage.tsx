import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function LoginPage({
  onBack,
  onOtpRequested,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
}: {
  onBack: () => void;
  onOtpRequested: (email: string) => void;
  onGoRegisterCustomer?: () => void;
  onGoRegisterProfessional?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const input: React.CSSProperties = {
    width: '100%',
    height: 54,
    borderRadius: 16,
    border: '1px solid #F1E4D8',
    padding: '0 14px',
    marginTop: 10,
    outline: 'none',
    fontSize: 15,
    background: '#fff',
    boxSizing: 'border-box',
    color: colors.text,
  };

  const handleSendCode = async () => {
    if (isLoading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert('Inserisci email.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Ti abbiamo inviato un codice via email.');
      onOtpRequested(cleanEmail);
    } catch (error) {
      console.error('Errore invio codice login:', error);
      alert('Errore durante l’invio del codice.');
    } finally {
      setIsLoading(false);
    }
  };

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
          margin: '4px 0 0',
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        Accedi con codice
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
        Inserisci la tua email e riceverai un codice di accesso.
      </p>

      <div
        style={{
          marginTop: 18,
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 24,
          padding: 18,
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: colors.muted,
            marginBottom: 4,
          }}
        >
          Email
        </div>
        <input
          style={input}
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleSendCode();
            }
          }}
        />

        <button
          onClick={() => void handleSendCode()}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: 18,
            border: 'none',
            borderRadius: 16,
            padding: '14px 16px',
            background: colors.primary,
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {isLoading ? 'Invio in corso...' : 'Ricevi codice'}
        </button>

        <button
          onClick={onBack}
          style={{
            width: '100%',
            marginTop: 10,
            border: '1px solid #E9D7C7',
            borderRadius: 16,
            padding: '14px 16px',
            background: '#fff',
            color: colors.text,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Torna indietro
        </button>

        <div
          style={{
            marginTop: 18,
            display: 'grid',
            gap: 10,
          }}
        >
          <button
            onClick={onGoRegisterCustomer}
            style={{
              border: 'none',
              background: '#F7F1EE',
              borderRadius: 14,
              padding: '12px 14px',
              fontWeight: 700,
              color: colors.text,
              cursor: 'pointer',
            }}
          >
            Registrati come cliente
          </button>

          <button
            onClick={onGoRegisterProfessional}
            style={{
              border: 'none',
              background: '#F7F1EE',
              borderRadius: 14,
              padding: '12px 14px',
              fontWeight: 700,
              color: colors.text,
              cursor: 'pointer',
            }}
          >
            Registrati come professionista
          </button>
        </div>
      </div>
    </div>
  );
}
