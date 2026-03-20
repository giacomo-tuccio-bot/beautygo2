import BottomNav from '../components/BottomNav';
import { colors } from '../theme';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

export default function CustomerProfilePage({
  currentTab,
  onChangeTab,
  onLogout,
}: {
  currentTab: Tab;
  onChangeTab: (tab: Tab) => void;
  onLogout: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 120px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            Area Cliente
          </h1>

          <p
            style={{
              marginTop: 8,
              color: colors.muted,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Sei loggato come cliente.
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            border: 'none',
            borderRadius: 12,
            padding: '10px 14px',
            background: '#FFEAEA',
            color: '#C53B3B',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Esci
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 18,
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: colors.text,
            marginBottom: 10,
          }}
        >
          Profilo cliente
        </div>

        <div
          style={{
            color: colors.muted,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Questa sarà la dashboard cliente. Nel prossimo step possiamo aggiungere
          dati profilo, cronologia e prenotazioni.
        </div>
      </div>

      <BottomNav current={currentTab} onChange={onChangeTab} />
    </div>
  );
}