import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function LoginPage({
  onBack,
  onAdminLogin,
  onLoginSuccess,
}: {
  onBack: () => void;
  onAdminLogin: () => void;
  onLoginSuccess: () => void | Promise<void>;
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

    if (cleanEmail === 'admin' && cleanPassword === 'admin') {
      onAdminLogin();
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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert('Login riuscito ma sessione non disponibile. Riprova.');
        return;
      }

      await onLoginSuccess();
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
        }}
      >
        Clienti e professionisti
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
            marginTop: 14,
            marginBottom: 4,
          }}
        >
          Password
        </div>
        <input
          style={input}
          placeholder="Inserisci la tua password"
          type="password"
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
            padding: '14px 14px',
            background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </button>

        <button
          onClick={() => alert('Qui puoi collegare il reset password di Supabase Auth.')}
          style={{
            width: '100%',
            marginTop: 12,
            border: 'none',
            borderRadius: 16,
            padding: '14px 14px',
            background: '#FFF3E8',
            color: '#FF6A00',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Recupera password
        </button>
      </div>

      <div
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 14,
          width: 360,
          maxWidth: 'calc(100vw - 28px)',
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
          onClick={onBack}
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
          ← Indietro
        </button>
      </div>
    </div>
  );
}
