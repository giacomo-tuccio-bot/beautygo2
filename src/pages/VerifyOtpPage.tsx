import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function VerifyOtpPage({
  email,
  onBack,
  onVerified,
}: {
  email: string;
  onBack: () => void;
  onVerified: () => void | Promise<void>;
}) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
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
    letterSpacing: '0.2em',
    textAlign: 'center',
  };

  const verifyCode = async () => {
    if (isLoading) return;

    const cleanCode = code.trim();
    if (cleanCode.length < 6) {
      alert('Inserisci il codice ricevuto via email.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: cleanCode,
        type: 'email',
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Email verificata correttamente. Da ora puoi accedere con email e password.');
      await onVerified();
    } catch (error) {
      console.error('Errore verifica OTP:', error);
      alert('Errore durante la verifica del codice.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Codice inviato di nuovo.');
    } catch (error) {
      console.error('Errore invio OTP:', error);
      alert('Errore durante il reinvio del codice.');
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
        Verifica la tua email
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
        Abbiamo inviato un codice di verifica a
        <br />
        <strong style={{ color: colors.text }}>{email}</strong>
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
          Codice email
        </div>
        <input
          style={inputStyle}
          placeholder="000000"
          inputMode="numeric"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void verifyCode();
            }
          }}
        />

        <button
          onClick={() => void verifyCode()}
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
          {isLoading ? 'Verifica in corso...' : 'Verifica email'}
        </button>

        <button
          onClick={() => void resendCode()}
          disabled={isLoading}
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
          Invia di nuovo il codice
        </button>

        <button
          onClick={onBack}
          style={{
            width: '100%',
            marginTop: 10,
            border: 'none',
            borderRadius: 16,
            padding: '14px 16px',
            background: 'transparent',
            color: colors.muted,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Torna al login
        </button>
      </div>
    </div>
  );
}
