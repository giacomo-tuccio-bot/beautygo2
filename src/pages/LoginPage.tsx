import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage({
  onBack,
  onAdminLogin,
  onLoginSuccess,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
}: {
  onBack: () => void;
  onAdminLogin: () => void;
  onLoginSuccess: () => void;
  onGoRegisterCustomer: () => void;
  onGoRegisterProfessional: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 🔹 Admin login veloce
      if (email === 'admin' && password === 'admin') {
        onAdminLogin();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      console.error(err);
      alert('Errore durante il login');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: '1px solid #ddd',
    marginBottom: 12,
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
    marginTop: 10,
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
    marginTop: 10,
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ textAlign: 'center' }}>Accedi</h1>

      <p style={{ textAlign: 'center', marginBottom: 20 }}>
        Clienti e professionisti
      </p>

      {/* FORM */}
      <div
        style={{
          background: '#f5f5f5',
          borderRadius: 20,
          padding: 20,
        }}
      >
        <label>Email</label>
        <input
          style={inputStyle}
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          style={inputStyle}
          placeholder="Inserisci la tua password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} style={primaryButton}>
          Accedi
        </button>

        <button onClick={onGoRegisterCustomer} style={secondaryButton}>
          Registrati come cliente
        </button>

        <button onClick={onGoRegisterProfessional} style={secondaryButton}>
          Registrati come professionista
        </button>

        <button style={secondaryButton}>
          Recupera password
        </button>
      </div>

      {/* 🔙 BACK BUTTON (SOLO IN BASSO) */}
      <button
        onClick={onBack}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 14,
          border: 'none',
          background: '#e9ded6',
          color: '#ff7a00',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 20,
        }}
      >
        ← Indietro
      </button>
    </div>
  );
}
