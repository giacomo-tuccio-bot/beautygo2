import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function RegisterCustomerPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    citta: '',
    indirizzo: '',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 52,
    borderRadius: 16,
    border: '1px solid #F1E4D8',
    padding: '0 14px',
    marginTop: 8,
    fontSize: 14,
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    color: colors.text,
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.nome.trim() ||
      !form.cognome.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert('Compila almeno nome, cognome, email e password.');
      return;
    }

    const { error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    emailRedirectTo: window.location.origin,
  },
});

if (error) {
  alert(error.message);
  return;
}

alert('Registrazione completata! Controlla la tua email per confermare l’account.');
onBack();
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
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          margin: 0,
          textAlign: 'center',
        }}
      >
        Registrazione Cliente
      </h1>

      <p
        style={{
          color: colors.muted,
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        Inserisci i tuoi dati per creare il profilo cliente.
      </p>

      <div
        style={{
          marginTop: 18,
          background: '#fff',
          borderRadius: 24,
          padding: 18,
          boxShadow: colors.shadow,
        }}
      >
        <input
          style={inputStyle}
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Cognome"
          value={form.cognome}
          onChange={(e) => handleChange('cognome', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Numero di cellulare"
          value={form.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Città"
          value={form.citta}
          onChange={(e) => handleChange('citta', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Via / Indirizzo"
          value={form.indirizzo}
          onChange={(e) => handleChange('indirizzo', e.target.value)}
        />

        <button
          onClick={handleSubmit}
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
            cursor: 'pointer',
          }}
        >
          Registrati
        </button>
      </div>

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