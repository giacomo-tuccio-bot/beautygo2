import { colors } from '../theme';
import { Icon } from '../components/Icons';

const professionalsData: Record<string, any> = {
  'sofia-martini': {
    name: 'Sofia Martini',
    category: 'Parrucchiera Donna',
    city: 'Milano',
    rating: 4.8,
    reviewsCount: 128,
    description:
      'Parrucchiera specializzata in piega, colore, acconciature da evento e capelli sposa. Lavora a domicilio con servizio premium.',
    image: '',
    services: [
      { name: 'Piega', price: 25 },
      { name: 'Taglio donna', price: 35 },
      { name: 'Colore', price: 55 },
      { name: 'Capelli sposa', price: 120 },
    ],
    reviews: [
      { author: 'Giulia', rating: 5, text: 'Puntuale, bravissima e molto professionale.' },
      { author: 'Elena', rating: 5, text: 'Piega perfetta e lunga durata.' },
      { author: 'Chiara', rating: 4, text: 'Molto gentile e precisa.' },
    ],
  },
  'luca-bianchi': {
    name: 'Luca Bianchi',
    category: 'Barbiere',
    city: 'Napoli',
    rating: 4.9,
    reviewsCount: 96,
    description:
      'Barbiere uomo specializzato in barba, taglio uomo e sfumature moderne.',
    image: '',
    services: [
      { name: 'Taglio uomo', price: 20 },
      { name: 'Barba', price: 15 },
      { name: 'Taglio + barba', price: 30 },
    ],
    reviews: [
      { author: 'Marco', rating: 5, text: 'Taglio pulito e barba perfetta.' },
      { author: 'Antonio', rating: 5, text: 'Top, lo richiamerò.' },
    ],
  },
  'martina-neri': {
    name: 'Martina Neri',
    category: 'Estetista',
    city: 'Roma',
    rating: 4.7,
    reviewsCount: 84,
    description:
      'Estetista a domicilio per manicure, pedicure, trucco e trattamenti beauty.',
    image: '',
    services: [
      { name: 'Manicure', price: 30 },
      { name: 'Pedicure', price: 35 },
      { name: 'Trucco', price: 45 },
      { name: 'Ceretta', price: 25 },
    ],
    reviews: [
      { author: 'Sara', rating: 5, text: 'Molto delicata e professionale.' },
      { author: 'Monica', rating: 4, text: 'Trucco bellissimo.' },
    ],
  },
};

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} style={{ opacity: i < Math.round(rating) ? 1 : 0.25 }}>
      <Icon name="star" size={14} color="#FF7A00" />
    </div>
  ));
}

function Avatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  if (image && image.trim() !== '') {
    return (
      <img
        src={image}
        alt={name}
        style={{
          width: '100%',
          height: 240,
          objectFit: 'cover',
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFE2CC, #FFF1E6)',
        color: '#FF6A00',
        fontSize: 56,
        fontWeight: 800,
        letterSpacing: '1px',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function ProfessionalDetailPage({
  professionalId,
  onBack,
}: {
  professionalId: string;
  onBack: () => void;
}) {
  const pro = professionalsData[professionalId];

  if (!pro) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
          padding: '18px 18px 140px',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.96)',
            borderRadius: 24,
            padding: 18,
            boxShadow: colors.shadow,
            textAlign: 'center',
          }}
        >
          Professionista non trovato.
        </div>

        <div
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
            justifyContent: 'space-between',
            padding: '0 14px',
            zIndex: 50,
          }}
        >
          <button
            onClick={onBack}
            style={{
              border: 'none',
              borderRadius: 16,
              padding: '12px 18px',
              background: '#FFF3E8',
              color: '#FF7A00',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            ← Indietro
          </button>

          <button
            style={{
              border: 'none',
              borderRadius: 16,
              padding: '12px 18px',
              background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Prenota ora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 140px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: colors.shadow,
        }}
      >
        <Avatar name={pro.name} image={pro.image} />

        <div style={{ padding: 18 }}>
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: colors.text,
              }}
            >
              {pro.name}
            </div>

            <div
              style={{
                color: '#FF6A00',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {pro.category}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              color: colors.muted,
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {pro.city}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 3,
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderStars(pro.rating)}
            <span style={{ marginLeft: 6, fontSize: 13, color: colors.muted }}>
              {pro.rating} ({pro.reviewsCount} recensioni)
            </span>
          </div>

          <p
            style={{
              marginTop: 16,
              color: '#676770',
              fontSize: 14,
              lineHeight: 1.65,
              textAlign: 'center',
            }}
          >
            {pro.description}
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 24,
          padding: 18,
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          Listino servizi
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          {pro.services.map((service: any) => (
            <div
              key={service.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: '#FFF8F1',
                borderRadius: 16,
              }}
            >
              <span style={{ fontWeight: 700, color: colors.text }}>{service.name}</span>
              <span style={{ fontWeight: 800, color: '#FF7A00' }}>€ {service.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 24,
          padding: 18,
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          Recensioni
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
          {pro.reviews.map((review: any, index: number) => (
            <div
              key={index}
              style={{
                padding: 14,
                borderRadius: 18,
                background: '#FFF8F1',
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {review.author}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 3,
                  marginTop: 6,
                  justifyContent: 'center',
                }}
              >
                {renderStars(review.rating)}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: '#676770',
                  lineHeight: 1.55,
                  textAlign: 'center',
                }}
              >
                {review.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BARRA PRO IN BASSO */}
      <div
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
          justifyContent: 'space-between',
          padding: '0 14px',
          zIndex: 50,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: 'none',
            borderRadius: 16,
            padding: '12px 18px',
            background: '#FFF3E8',
            color: '#FF7A00',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ← Indietro
        </button>

        <button
          style={{
            border: 'none',
            borderRadius: 16,
            padding: '12px 18px',
            background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Prenota ora
        </button>
      </div>
    </div>
  );
}