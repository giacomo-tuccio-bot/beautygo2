import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function LoginPage({
  onBack,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
}: {
  onBack: () => void;
  onGoRegisterCustomer?: () => void;
  onGoRegisterProfessional?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    if (isLoading) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert('Inserisci email e password.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        alert(error.message);
        return;
      }
    } catch (error) {
      console.error('Errore login:', error);
      alert('Errore durante il login.');
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
        Accedi
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
        Inserisci email e password per accedere.
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
        />

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: colors.muted,
            marginTop: 12,
            marginBottom: 4,
          }}
        >
          Password
        </div>
        <input
          style={input}
          type="password"
          placeholder="Inserisci la tua password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleLogin();
            }
          }}
        />

        <button
          onClick={() => void handleLogin()}
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
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
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
            paddingTop: 16,
            borderTop: '1px solid #F3E7DC',
            display: 'grid',
            gap: 10,
          }}
        >
          <button
            onClick={onGoRegisterCustomer}
            style={{
              width: '100%',
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
            Registrati come cliente
          </button>

          <button
            onClick={onGoRegisterProfessional}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 16,
              padding: '14px 16px',
              background: '#3B2F2F',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
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
