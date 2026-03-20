import { Icon } from './Icons';

type Tab = 'home' | 'discover' | 'bookings' | 'profile';

export default function BottomNav({
  current,
  onChange,
}: {
  current: Tab;
  onChange: (tab: Tab) => void;
}) {
  const items: { key: Tab; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'discover', label: 'Scopri', icon: 'search' },
    { key: 'bookings', label: 'Prenota', icon: 'calendar' },
    { key: 'profile', label: 'Profilo', icon: 'user' },
  ];

  return (
    <nav
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
        justifyContent: 'space-around',
        zIndex: 20,
      }}
    >
      {items.map((item) => {
        const active = current === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            style={{
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              fontWeight: 700,
              color: active ? '#FF6A00' : '#8C8C96',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active
                  ? 'linear-gradient(135deg, rgba(255,138,31,0.18), rgba(255,90,0,0.10))'
                  : 'transparent',
              }}
            >
              <Icon
                name={item.icon}
                size={21}
                color={active ? '#FF6A00' : '#8C8C96'}
              />
            </div>
            <span style={{ fontSize: 11 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}