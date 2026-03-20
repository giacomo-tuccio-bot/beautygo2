import { colors } from '../theme';

export default function ProfilePage({
  onGoLogin,
  onGoRegisterCustomer,
  onGoProOnboarding,
}: {
  onGoLogin: () => void;
  onGoRegisterCustomer: () => void;
  onGoProOnboarding: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 96px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        Profilo
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
        Accedi oppure registrati per prenotare servizi o lavorare con BeautyGo.
      </p>

      <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
        <div
          style={{
            background: colors.card,
            borderRadius: 28,
            padding: 20,
            boxShadow: colors.shadow,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            Area cliente
          </div>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: colors.muted,
              fontSize: 15,
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            Accedi al tuo account per gestire prenotazioni, profilo e servizi preferiti.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <button onClick={onGoLogin} style={primaryButton}>
              Accedi
            </button>

            <button onClick={onGoRegisterCustomer} style={secondaryButton}>
              Registrati come cliente
            </button>
          </div>
        </div>

        <div
          style={{
            background: colors.card,
            borderRadius: 28,
            padding: 20,
            boxShadow: colors.shadow,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            Sei un professionista?
          </div>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: colors.muted,
              fontSize: 15,
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            Completa l’onboarding solo dopo il login. Il profilo verrà aggiornato e poi
            potrai caricare servizi, documenti e dati fiscali dalla dashboard professionista.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <button onClick={onGoLogin} style={secondaryButton}>
              Accedi
            </button>

            <button onClick={onGoProOnboarding} style={primaryButton}>
              Diventa professionista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  borderRadius: 18,
  padding: '15px 18px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
};

const secondaryButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  borderRadius: 18,
  padding: '15px 18px',
  background: '#FFF3E8',
  color: '#FF6A00',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
};
