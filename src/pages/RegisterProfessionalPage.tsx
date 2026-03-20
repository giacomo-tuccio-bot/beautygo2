import React, { useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { colors } from '../theme';
import type { ProOnboardingFormData } from './ProOnboardingPage';

export type RegisterProfessionalFormData = ProOnboardingFormData & {
  password: string;
};

export default function RegisterProfessionalPage({
  onBack,
  onRegistrationComplete,
  onGoLogin,
}: {
  onBack: () => void;
  onRegistrationComplete: (data: ProOnboardingFormData) => void | Promise<void>;
  onGoLogin: () => void;
}) {
  const [form, setForm] = useState<RegisterProfessionalFormData>({
    nome: '',
    cognome: '',
    email: '',
    password: '',
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
      ['password', form.password],
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

    if (form.password.trim().length < 6) {
      alert('La password deve contenere almeno 6 caratteri.');
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
    const cleanPassword = form.password.trim();

    try {
      const signUpResult = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signUpResult.error) {
        alert(signUpResult.error.message);
        return;
      }

     const handleSubmit = async () => {
  if (isSubmitting) return;
  if (!validate()) return;

  setIsSubmitting(true);

  const cleanEmail = form.email.trim().toLowerCase();
  const cleanPassword = form.password.trim();

  try {
    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('Registrazione completata! Controlla la tua email per confermare l’account.');

    // dopo registrazione → vai al login
    onGoLogin();

  } catch (error) {
    console.error('Errore registrazione professionista:', error);
    alert('Errore durante la registrazione professionista.');
  } finally {
    setIsSubmitting(false);
  }
};

      if (!session) {
        alert(
          'Account creato, ma la sessione non è stata aperta automaticamente. Effettua il login e completa il profilo professionista.'
        );
        onGoLogin();
        return;
      }

      await onRegistrationComplete({
        nome: form.nome,
        cognome: form.cognome,
        email: cleanEmail,
        telefono: form.telefono,
        citta: form.citta,
        indirizzo: form.indirizzo,
        tipoDocumentoFiscale: form.tipoDocumentoFiscale,
        valoreDocumentoFiscale: form.valoreDocumentoFiscale,
        intestatarioFatturazione: form.intestatarioFatturazione,
        ragioneSociale: form.ragioneSociale,
        codiceFiscaleFatturazione: form.codiceFiscaleFatturazione,
        partitaIvaFatturazione: form.partitaIvaFatturazione,
        indirizzoFatturazione: form.indirizzoFatturazione,
        cittaFatturazione: form.cittaFatturazione,
        capFatturazione: form.capFatturazione,
        provinciaFatturazione: form.provinciaFatturazione,
        pec: form.pec,
        codiceDestinatario: form.codiceDestinatario,
      });
    } catch (error) {
      console.error('Errore registrazione professionista:', error);
      alert('Errore durante la registrazione professionista.');
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
        Registrazione completa con anagrafica, contatti e dati fiscali. I campi cambiano in
        base alla scelta tra Partita IVA e Codice Fiscale.
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
          type="password"
          placeholder="Password *"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          autoComplete="new-password"
        />
        <input
          style={inputStyle}
          placeholder="Numero di cellulare *"
          value={form.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Città operativa *"
          value={form.citta}
          onChange={(e) => handleChange('citta', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Indirizzo professionale *"
          value={form.indirizzo}
          onChange={(e) => handleChange('indirizzo', e.target.value)}
        />

        <div style={sectionTitle}>Identificazione fiscale</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 8,
          }}
        >
          <button
            type="button"
            onClick={() => handleChange('tipoDocumentoFiscale', 'piva')}
            style={toggleButton(isVat)}
          >
            Partita IVA
          </button>
          <button
            type="button"
            onClick={() => handleChange('tipoDocumentoFiscale', 'cf')}
            style={toggleButton(!isVat)}
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

        <div style={sectionTitle}>Dati fiscali di fatturazione</div>
        <input
          style={inputStyle}
          placeholder={isVat ? 'Intestatario fatturazione / Legale rappresentante *' : 'Intestatario fatturazione *'}
          value={form.intestatarioFatturazione}
          onChange={(e) => handleChange('intestatarioFatturazione', e.target.value)}
        />

        {isVat ? (
          <>
            <input
              style={inputStyle}
              placeholder="Ragione sociale *"
              value={form.ragioneSociale}
              onChange={(e) => handleChange('ragioneSociale', e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Partita IVA di fatturazione *"
              value={form.partitaIvaFatturazione}
              onChange={(e) => handleChange('partitaIvaFatturazione', e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Codice fiscale di fatturazione (se disponibile)"
              value={form.codiceFiscaleFatturazione}
              onChange={(e) => handleChange('codiceFiscaleFatturazione', e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              style={inputStyle}
              placeholder="Codice fiscale di fatturazione *"
              value={form.codiceFiscaleFatturazione}
              onChange={(e) => handleChange('codiceFiscaleFatturazione', e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Ragione sociale / nome attività (facoltativo)"
              value={form.ragioneSociale}
              onChange={(e) => handleChange('ragioneSociale', e.target.value)}
            />
          </>
        )}

        <input
          style={inputStyle}
          placeholder="Indirizzo fiscale *"
          value={form.indirizzoFatturazione}
          onChange={(e) => handleChange('indirizzoFatturazione', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Città fiscale *"
          value={form.cittaFatturazione}
          onChange={(e) => handleChange('cittaFatturazione', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="CAP *"
          value={form.capFatturazione}
          onChange={(e) => handleChange('capFatturazione', e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Provincia *"
          value={form.provinciaFatturazione}
          onChange={(e) => handleChange('provinciaFatturazione', e.target.value)}
        />
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
            padding: '14px 14px',
            background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Registrazione in corso...' : 'Registrati come professionista'}
        </button>

        <button
          type="button"
          onClick={onGoLogin}
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
          Ho già un account, accedi
        </button>
      </div>

      <BottomBack onBack={onBack} />
    </div>
  );
}

function toggleButton(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    border: 'none',
    borderRadius: 16,
    padding: '14px 12px',
    background: active ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)' : '#FFF3E8',
    color: active ? '#fff' : '#FF6A00',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
  };
}

function BottomBack({ onBack }: { onBack: () => void }) {
  return (
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
  );
}
