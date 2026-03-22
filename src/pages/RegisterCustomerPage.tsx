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

    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim()) {
      alert('Compila almeno nome, cognome ed email.');
      return;
    }

    if (!form.email.includes('@')) {
      alert('Inserisci un indirizzo email valido.');
      return;
    }

    setIsSubmitting(true);

    const cleanEmail = form.email.trim().toLowerCase();

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

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
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

      alert('Ti abbiamo inviato un codice via email.');
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
        Inserisci i tuoi dati e riceverai un codice di verifica via email.
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
          onClick={() => void handleSubmit()}
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
          {isSubmitting ? 'Invio in corso...' : 'Registrati e ricevi il codice'}
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
