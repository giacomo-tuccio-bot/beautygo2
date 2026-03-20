import React, { useMemo, useState } from 'react';
import { colors } from '../theme';

export type ProOnboardingFormData = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  citta: string;
  indirizzo: string;
  tipoDocumentoFiscale: string;
  valoreDocumentoFiscale: string;
  intestatarioFatturazione: string;
  ragioneSociale: string;
  codiceFiscaleFatturazione: string;
  partitaIvaFatturazione: string;
  indirizzoFatturazione: string;
  cittaFatturazione: string;
  capFatturazione: string;
  provinciaFatturazione: string;
  pec: string;
  codiceDestinatario: string;
};

export default function ProOnboardingPage({
  isAuthenticated,
  currentUserEmail,
  onBack,
  onGoLogin,
  onComplete,
}: {
  isAuthenticated: boolean;
  currentUserEmail?: string;
  onBack: () => void;
  onGoLogin: () => void;
  onComplete: (data: ProOnboardingFormData) => void | Promise<void>;
}) {
  const [form, setForm] = useState<ProOnboardingFormData>({
    nome: '',
    cognome: '',
    email: currentUserEmail ?? '',
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

  const fiscalLabel = useMemo(
    () =>
      form.tipoDocumentoFiscale === 'piva'
        ? 'Inserisci Partita IVA'
        : 'Inserisci Codice Fiscale',
    [form.tipoDocumentoFiscale]
  );

  const handleChange = (key: keyof ProOnboardingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim()) {
      alert('Compila almeno nome, cognome ed email.');
      return false;
    }

    if (!form.telefono.trim() || !form.citta.trim() || !form.indirizzo.trim()) {
      alert('Compila anche telefono, città e indirizzo.');
      return false;
    }

    if (!form.valoreDocumentoFiscale.trim()) {
      alert('Inserisci il documento fiscale principale.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!isAuthenticated) {
      alert('Devi prima fare login.');
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onComplete({
        ...form,
        email: form.email.trim().toLowerCase(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '18px 18px 120px',
          background:
            'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
        }}
      >
        <TopBack onBack={onBack} />

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Diventa professionista
        </h1>

        <div
          style={{
            marginTop: 18,
            background: '#fff',
            borderRadius: 24,
            padding: 20,
            boxShadow: colors.shadow,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: colors.muted,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            L’onboarding professionista può essere completato solo con un utente autenticato.
            Prima accedi, poi torna qui e compila il modulo.
          </p>

          <button
            onClick={onGoLogin}
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
            Vai al login
          </button>
        </div>

        <BottomBack onBack={onBack} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 120px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <TopBack onBack={onBack} />

      <h1
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          margin: 0,
          textAlign: 'center',
        }}
      >
        Onboarding Professionista
      </h1>

      <p
        style={{
          color: colors.muted,
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        Questo step aggiorna il tuo profilo esistente e ti abilita alla dashboard professionista.
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
        <div style={sectionTitle}>Dati anagrafici e contatti</div>

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
          autoComplete="email"
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

        <div style={{ marginTop: 16 }}>
          <div style={label}>Identificazione fiscale</div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => handleChange('tipoDocumentoFiscale', 'piva')}
              style={{
                ...pillButton,
                background:
                  form.tipoDocumentoFiscale === 'piva'
                    ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                    : '#FFF3E8',
                color: form.tipoDocumentoFiscale === 'piva' ? '#fff' : '#FF6A00',
              }}
            >
              Partita IVA
            </button>

            <button
              type="button"
              onClick={() => handleChange('tipoDocumentoFiscale', 'cf')}
              style={{
                ...pillButton,
                background:
                  form.tipoDocumentoFiscale === 'cf'
                    ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                    : '#FFF3E8',
                color: form.tipoDocumentoFiscale === 'cf' ? '#fff' : '#FF6A00',
              }}
            >
              Codice Fiscale
            </button>
          </div>

          <input
            style={inputStyle}
            placeholder={fiscalLabel}
            value={form.valoreDocumentoFiscale}
            onChange={(e) => handleChange('valoreDocumentoFiscale', e.target.value)}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={sectionTitle}>Dati di fatturazione</div>

          <input
            style={inputStyle}
            placeholder="Intestatario fatturazione"
            value={form.intestatarioFatturazione}
            onChange={(e) => handleChange('intestatarioFatturazione', e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Ragione sociale"
            value={form.ragioneSociale}
            onChange={(e) => handleChange('ragioneSociale', e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Codice fiscale fatturazione"
            value={form.codiceFiscaleFatturazione}
            onChange={(e) => handleChange('codiceFiscaleFatturazione', e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Partita IVA fatturazione"
            value={form.partitaIvaFatturazione}
            onChange={(e) => handleChange('partitaIvaFatturazione', e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Indirizzo fatturazione"
            value={form.indirizzoFatturazione}
            onChange={(e) => handleChange('indirizzoFatturazione', e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Città fatturazione"
            value={form.cittaFatturazione}
            onChange={(e) => handleChange('cittaFatturazione', e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              style={inputStyle}
              placeholder="CAP"
              value={form.capFatturazione}
              onChange={(e) => handleChange('capFatturazione', e.target.value)}
            />

            <input
              style={inputStyle}
              placeholder="Provincia"
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
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 18,
            background: '#FFF8F1',
            border: '1px solid #F6E5D7',
            color: colors.muted,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Dopo il salvataggio vedrai la dashboard professionista. Da lì potrai completare
          servizi, prezzi, documenti e verifica.
        </div>

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
          {isSubmitting ? 'Salvataggio...' : 'Completa onboarding'}
        </button>
      </div>

      <BottomBack onBack={onBack} />
    </div>
  );
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

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: colors.text,
};

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: colors.muted,
};

const pillButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 999,
  padding: '10px 14px',
  fontWeight: 800,
  cursor: 'pointer',
};


function TopBack({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{
        border: 'none',
        background: '#FFFFFF',
        color: '#FF7A00',
        fontWeight: 800,
        fontSize: 15,
        padding: '12px 14px',
        borderRadius: 14,
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        marginBottom: 10,
      }}
    >
      ← Indietro
    </button>
  );
}
