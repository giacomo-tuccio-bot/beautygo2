import BottomNav from '../components/BottomNav';
import { colors } from '../theme';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

export default function ProfilePage({
  currentTab,
  onChangeTab,
  onGoLogin,
  onGoRegisterCustomer,
  onGoRegisterProfessional,
}: {
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  onGoLogin: () => void;
  onGoRegisterCustomer: () => void;
  onGoRegisterProfessional: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 120px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
        boxSizing: 'border-box',
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
        Accedi con un solo account oppure scegli una registrazione dedicata come cliente o
        professionista.
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
            Accesso unico
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
            Clienti e professionisti accedono dalla stessa pagina. Dopo il login il sistema
            riconosce il profilo associato al tuo account.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <button onClick={onGoLogin} style={primaryButton}>
              Accedi
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
            Registrazione cliente
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
            Crea il tuo profilo cliente per prenotare servizi, salvare preferiti e gestire gli
            appuntamenti.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
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
            Registrazione professionista
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
            Compila una registrazione completa con dati personali, professionali e fiscali.
            Potrai indicare in modo distinto se operi con Partita IVA o Codice Fiscale.
          </p>

          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <button onClick={onGoRegisterProfessional} style={primaryButton}>
              Registrati come professionista
            </button>
          </div>
        </div>
      </div>

      <BottomNav current={currentTab} onChange={onChangeTab} />
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
