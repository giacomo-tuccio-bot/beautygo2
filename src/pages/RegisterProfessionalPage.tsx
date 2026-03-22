import React, { useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { colors } from '../theme';
import type { ProOnboardingFormData } from './ProOnboardingPage';

export type RegisterProfessionalFormData = ProOnboardingFormData;

export default function RegisterProfessionalPage({
  onBack,
  onOtpRequested,
}: {
  onBack: () => void;
  onOtpRequested: (email: string) => void;
}) {
  const [form, setForm] = useState<RegisterProfessionalFormData>({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    citta: '',
    indirizzo: '',
    tipoDocumentoFiscale: 'piva',
    valoreDocumentoFiscale: '',
    intestatarioFatturazione: '',
    ragioneSociale: '',
    codiceFiscaleFatturazione: '',
    partitaIvaFatturazione: '',
    indirizzoFatturazione: '',
    cittaFatturazione: '',
    capFatturazione: '',
    provinciaFatturazione: '',
    pec: '',
    codiceDestinatario: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVat = form.tipoDocumentoFiscale === 'piva';

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

  const sectionTitle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 800,
    color: colors.text,
    marginTop: 14,
    marginBottom: 4,
  };

  const fiscalMainLabel = useMemo(
    () => (isVat ? 'Partita IVA principale *' : 'Codice Fiscale principale *'),
    [isVat]
  );

  const handleChange = (key: keyof RegisterProfessionalFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const commonRequired: Array<[string, string]> = [
      ['nome', form.nome],
      ['cognome', form.cognome],
      ['email', form.email],
      ['telefono', form.telefono],
      ['citta', form.citta],
      ['indirizzo', form.indirizzo],
      ['valoreDocumentoFiscale', form.valoreDocumentoFiscale],
      ['intestatarioFatturazione', form.intestatarioFatturazione],
      ['indirizzoFatturazione', form.indirizzoFatturazione],
      ['cittaFatturazione', form.cittaFatturazione],
      ['capFatturazione', form.capFatturazione],
      ['provinciaFatturazione', form.provinciaFatturazione],
    ];

    const missingCommon = commonRequired.find(([, value]) => !value.trim());
    if (missingCommon) {
      alert('Compila tutti i campi obbligatori del professionista.');
      return false;
    }

    if (!form.email.includes('@')) {
      alert('Inserisci un indirizzo email valido.');
      return false;
    }

    if (isVat) {
      if (!form.ragioneSociale.trim() || !form.partitaIvaFatturazione.trim()) {
        alert('Per la registrazione con Partita IVA devi compilare ragione sociale e partita IVA di fatturazione.');
        return false;
      }
    } else {
      if (!form.codiceFiscaleFatturazione.trim()) {
        alert('Per la registrazione con Codice Fiscale devi compilare il codice fiscale di fatturazione.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);

    const cleanEmail = form.email.trim().toLowerCase();

    try {
      const { error: pendingError } = await supabase.from('pending_registrations').insert({
        email: cleanEmail,
        role: 'professional',
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        telefono: form.telefono.trim(),
        citta: form.citta.trim(),
        indirizzo: form.indirizzo.trim(),
        tipoDocumentoFiscale: form.tipoDocumentoFiscale,
        valoreDocumentoFiscale: form.valoreDocumentoFiscale.trim(),
        intestatarioFatturazione: form.intestatarioFatturazione.trim(),
        ragioneSociale: form.ragioneSociale.trim(),
        codiceFiscaleFatturazione: form.codiceFiscaleFatturazione.trim(),
        partitaIvaFatturazione: form.partitaIvaFatturazione.trim(),
        indirizzoFatturazione: form.indirizzoFatturazione.trim(),
        cittaFatturazione: form.cittaFatturazione.trim(),
        capFatturazione: form.capFatturazione.trim(),
        provinciaFatturazione: form.provinciaFatturazione.trim(),
        pec: form.pec.trim(),
        codiceDestinatario: form.codiceDestinatario.trim(),
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
            role: 'professional',
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
      console.error('Errore durante la registrazione professionista:', error);
      alert(
        `Errore durante la registrazione professionista: ${
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
        Registrazione Professionista
      </h1>

      <p
        style={{
          color: colors.muted,
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        Registrazione completa con anagrafica, contatti e dati fiscali.
        <br />
        Riceverai un codice di verifica via email.
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
        <div style={sectionTitle}>Dati account e contatti</div>

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
          placeholder="Telefono *"
          value={form.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Città *"
          value={form.citta}
          onChange={(e) => handleChange('citta', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Indirizzo *"
          value={form.indirizzo}
          onChange={(e) => handleChange('indirizzo', e.target.value)}
        />

        <div style={sectionTitle}>Documento fiscale principale</div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => handleChange('tipoDocumentoFiscale', 'piva')}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              background: isVat ? colors.primary : '#F7F1EE',
              color: isVat ? '#fff' : colors.text,
            }}
          >
            Partita IVA
          </button>
          <button
            onClick={() => handleChange('tipoDocumentoFiscale', 'cf')}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              background: !isVat ? colors.primary : '#F7F1EE',
              color: !isVat ? '#fff' : colors.text,
            }}
          >
            Codice Fiscale
          </button>
        </div>

        <input
          style={inputStyle}
          placeholder={fiscalMainLabel}
          value={form.valoreDocumentoFiscale}
          onChange={(e) => handleChange('valoreDocumentoFiscale', e.target.value)}
        />

        <div style={sectionTitle}>Dati di fatturazione</div>

        <input
          style={inputStyle}
          placeholder="Intestatario fatturazione *"
          value={form.intestatarioFatturazione}
          onChange={(e) => handleChange('intestatarioFatturazione', e.target.value)}
        />

        {isVat ? (
          <>
            <input
              style={inputStyle}
              placeholder="Ragione Sociale *"
              value={form.ragioneSociale}
              onChange={(e) => handleChange('ragioneSociale', e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Partita IVA di fatturazione *"
              value={form.partitaIvaFatturazione}
              onChange={(e) => handleChange('partitaIvaFatturazione', e.target.value)}
            />
          </>
        ) : (
          <input
            style={inputStyle}
            placeholder="Codice Fiscale di fatturazione *"
            value={form.codiceFiscaleFatturazione}
            onChange={(e) => handleChange('codiceFiscaleFatturazione', e.target.value)}
          />
        )}

        <input
          style={inputStyle}
          placeholder="Indirizzo fatturazione *"
          value={form.indirizzoFatturazione}
          onChange={(e) => handleChange('indirizzoFatturazione', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Città fatturazione *"
          value={form.cittaFatturazione}
          onChange={(e) => handleChange('cittaFatturazione', e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inputStyle, marginTop: 8, flex: 1 }}
            placeholder="CAP *"
            value={form.capFatturazione}
            onChange={(e) => handleChange('capFatturazione', e.target.value)}
          />
          <input
            style={{ ...inputStyle, marginTop: 8, flex: 1 }}
            placeholder="Provincia *"
            value={form.provinciaFatturazione}
            onChange={(e) => handleChange('provinciaFatturazione', e.target.value)}
          />
        </div>

        <input
          style={inputStyle}
          placeholder="PEC"
          value={form.pec}
          onChange={(e) => handleChange('pec', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Codice destinatario"
          value={form.codiceDestinatario}
          onChange={(e) => handleChange('codiceDestinatario', e.target.value)}
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
