import React, { useState } from 'react';
import { colors } from '../theme';
import { supabase } from '../lib/supabase';

export default function RegisterCustomerPage({
  onBack,
  onOtpRequested,
}: {
  onBack: () => void;
  onOtpRequested: (email: string) => void;
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim() || !form.password.trim()) {
      alert('Compila nome, cognome, email e password.');
      return;
    }

    if (!form.email.includes('@')) {
      alert('Inserisci un indirizzo email valido.');
      return;
    }

    if (form.password.trim().length < 6) {
      alert('La password deve contenere almeno 6 caratteri.');
      return;
    }

    setIsSubmitting(true);

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password.trim();

    try {
      const { error: pendingError } = await supabase.from('pending_registrations').insert({
        email: cleanEmail,
        role: 'customer',
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        telefono: form.telefono.trim(),
        citta: form.citta.trim(),
        indirizzo: form.indirizzo.trim(),
      });

      if (pendingError) {
        if ((pendingError.message || '').toLowerCase().includes('duplicate key')) {
          alert(
            'Esiste già una registrazione in attesa per questa email. Inserisci il codice già ricevuto oppure usa un’altra email.'
          );
        } else {
          alert(pendingError.message);
        }
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            role: 'customer',
          },
        },
      });

      if (error) {
        await supabase.from('pending_registrations').delete().eq('email', cleanEmail);
        alert(error.message);
        return;
      }

      alert('Registrazione avviata. Ti abbiamo inviato un codice di verifica via email.');
      onOtpRequested(cleanEmail);
    } catch (error: any) {
      alert(
        `Errore durante la registrazione cliente: ${
          error?.message || JSON.stringify(error) || 'errore sconosciuto'
        }`
      );
    } finally {
      setIsSubmitting(false);
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
        Inserisci i tuoi dati, verifica l’email con il codice e poi accederai con email e password.
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
          placeholder="Nome *"
          value={form.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Cognome *"
          value={form.cognome}
          onChange={(e) => handleChange('cognome', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Email *"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          autoComplete="email"
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password *"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          autoComplete="new-password"
        />
        <input
          style={inputStyle}
          placeholder="Telefono"
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
          placeholder="Indirizzo"
          value={form.indirizzo}
          onChange={(e) => handleChange('indirizzo', e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
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
          {isSubmitting ? 'Invio in corso...' : 'Registrati'}
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
      </div>
    </div>
  );
}
