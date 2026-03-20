import React from 'react';
import { colors } from '../theme';
import { Icon } from '../components/Icons';

const categories = [
  {
    name: 'Capelli Donna',
    icon: 'woman',
    bg: '#FFE0EA',
    iconColor: '#FF6B9D',
    targetMacro: 'Capelli Donna',
  },
  {
    name: 'Capelli Uomo',
    icon: 'man',
    bg: '#D9EBFF',
    iconColor: '#1976D2',
    targetMacro: 'Capelli Uomo',
  },
  {
    name: 'Epilazione Donna',
    icon: 'beauty',
    bg: '#FDE7D7',
    iconColor: '#FF7A00',
    targetMacro: 'Epilazione Donna',
  },
  {
    name: 'Epilazione Uomo',
    icon: 'barber',
    bg: '#F8E3BE',
    iconColor: '#FF8F00',
    targetMacro: 'Epilazione Uomo',
  },
  {
    name: 'Mani',
    icon: 'beauty',
    bg: '#EADCFB',
    iconColor: '#8E5BCE',
    targetMacro: 'Mani',
  },
  {
    name: 'Piedi',
    icon: 'beauty',
    bg: '#DDEFD8',
    iconColor: '#388E3C',
    targetMacro: 'Piedi',
  },
  {
    name: 'Viso',
    icon: 'sparkle',
    bg: '#FFF0D9',
    iconColor: '#D97A00',
    targetMacro: 'Viso',
  },
];

const popularServices = [
  {
    name: 'Piega & Styling',
    category: 'Capelli',
    targetService: 'Piega',
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Manicure Gel',
    category: 'Unghie',
    targetService: 'Manicure base',
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Taglio Uomo',
    category: 'Barbiere',
    targetService: 'Taglio uomo',
    image:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Capelli Sposa',
    category: 'Wedding',
    targetService: 'Capelli sposa',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  },
];

const topProfessionals = [
  {
    id: 'sofia-martini',
    name: 'Sofia Martini',
    role: 'Parrucchiera Donna',
    city: 'Milano',
    rating: 4.9,
  },
  {
    id: 'luca-bianchi',
    name: 'Luca Bianchi',
    role: 'Barbiere',
    city: 'Napoli',
    rating: 4.8,
  },
  {
    id: 'martina-neri',
    name: 'Martina Neri',
    role: 'Estetista',
    city: 'Roma',
    rating: 4.7,
  },
];

function getInitials(fullName: string) {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function HomePage({
  onOpenProfessional,
  onOpenService,
  onOpenMacroCategory,
  onGoDiscover,
  onGoBookings,
}: {
  onOpenProfessional: (id: string) => void;
  onOpenService: (serviceName: string) => void;
  onOpenMacroCategory: (macroCategory: string) => void;
  onGoDiscover: () => void;
  onGoBookings: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
        padding: '18px 16px 96px',
      }}
    >
      <div style={styles.heroHeader}>
        <h1 style={styles.greeting}>Ciao! 👋</h1>
        <p style={styles.subGreeting}>Prenota il tuo servizio beauty a domicilio</p>
      </div>

      <section style={styles.section}>
        <div style={styles.offerBanner}>
          <div style={styles.offerBadge}>✨ Offerta speciale</div>
          <div style={styles.offerTitle}>20% di sconto sul primo servizio!</div>
          <button style={styles.offerButton}>Prenota ora →</button>
          <div style={styles.offerGlow1} />
          <div style={styles.offerGlow2} />
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>Categorie</h2>
          <button onClick={onGoBookings} style={styles.linkButton}>
            Vedi tutte
          </button>
        </div>

        <div style={styles.categoriesCarousel}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onOpenMacroCategory(cat.targetMacro)}
              style={styles.categoryButton}
            >
              <div style={{ ...styles.categoryCircle, background: cat.bg }}>
                <Icon name={cat.icon} size={22} color={cat.iconColor} />
              </div>
              <div style={styles.categoryLabel}>{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>Servizi popolari</h2>
          <button onClick={onGoBookings} style={styles.linkButton}>
            Vedi tutti
          </button>
        </div>

        <div style={styles.servicesRow}>
          {popularServices.map((service) => (
            <button
              key={service.name}
              onClick={() => onOpenService(service.targetService)}
              style={styles.serviceCardButton}
            >
              <div style={styles.serviceCard}>
                <img
                  src={service.image}
                  alt={service.name}
                  style={styles.serviceImage}
                />
                <div style={styles.serviceBody}>
                  <div style={styles.serviceName}>{service.name}</div>
                  <div style={styles.serviceCategory}>{service.category}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>Top Professionisti</h2>
          <button onClick={onGoDiscover} style={styles.linkButton}>
            Vedi tutti
          </button>
        </div>

        <div style={styles.proList}>
          {topProfessionals.map((pro) => (
            <button
              key={pro.id}
              onClick={() => onOpenProfessional(pro.id)}
              style={styles.proCardButton}
            >
              <div style={styles.proCard}>
                <div style={styles.proAvatar}>{getInitials(pro.name)}</div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={styles.proName}>{pro.name}</div>
                  <div style={styles.proRole}>{pro.role}</div>
                  <div style={styles.proCity}>{pro.city}</div>
                </div>

                <div style={styles.proRating}>
                  <Icon name="star" size={12} color="#F2B94B" />
                  <span style={styles.proRatingText}>{pro.rating}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroHeader: {
    textAlign: 'center',
    marginBottom: 18,
  },
  greeting: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    color: colors.text,
    letterSpacing: '-0.5px',
  },
  subGreeting: {
    margin: '6px 0 0',
    fontSize: 15,
    color: colors.muted,
  },
  section: {
    marginTop: 16,
  },
  offerBanner: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #FF8A1F, #FF6A00)',
    borderRadius: 24,
    padding: 20,
    color: '#fff',
  },
  offerBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 14,
    position: 'relative',
    zIndex: 2,
  },
  offerTitle: {
    fontSize: 22,
    lineHeight: 1.15,
    fontWeight: 800,
    maxWidth: 220,
    position: 'relative',
    zIndex: 2,
  },
  offerButton: {
    marginTop: 14,
    border: 'none',
    background: '#fff',
    color: '#FF6A00',
    borderRadius: 999,
    padding: '10px 16px',
    fontWeight: 800,
    cursor: 'pointer',
    position: 'relative',
    zIndex: 2,
  },
  offerGlow1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.12)',
    right: -20,
    top: -10,
  },
  offerGlow2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    right: 60,
    bottom: -20,
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: colors.text,
  },
  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#FF6A00',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  categoriesCarousel: {
    display: 'flex',
    gap: 14,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  categoryButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'center',
    minWidth: 88,
  },
  categoryCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px',
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 700,
    lineHeight: 1.3,
    textAlign: 'center',
  },
  servicesRow: {
    display: 'flex',
    gap: 14,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  serviceCardButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
  serviceCard: {
    minWidth: 160,
    background: colors.card,
    borderRadius: 22,
    boxShadow: colors.shadow,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 124,
    objectFit: 'cover',
    display: 'block',
  },
  serviceBody: {
    padding: 12,
    textAlign: 'left',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.text,
  },
  serviceCategory: {
    marginTop: 4,
    fontSize: 13,
    color: '#FF6A00',
    fontWeight: 700,
  },
  proList: {
    display: 'grid',
    gap: 12,
  },
  proCardButton: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
  },
  proCard: {
    background: colors.card,
    borderRadius: 20,
    boxShadow: colors.shadow,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  proAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: 'linear-gradient(135deg, #FF8A1F, #FF6A00)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 18,
    flexShrink: 0,
  },
  proName: {
    fontSize: 15,
    fontWeight: 800,
    color: colors.text,
  },
  proRole: {
    marginTop: 4,
    fontSize: 13,
    color: '#FF6A00',
    fontWeight: 700,
  },
  proCity: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },
  proRating: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: '#FFF3D9',
    padding: '6px 8px',
    borderRadius: 999,
    flexShrink: 0,
  },
  proRatingText: {
    fontSize: 12,
    fontWeight: 800,
    color: '#7A5A00',
  },
};