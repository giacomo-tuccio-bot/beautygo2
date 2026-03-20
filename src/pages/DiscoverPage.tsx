import React, { useMemo, useState } from 'react';
import { colors } from '../theme';
import { Icon } from '../components/Icons';

const professionals = [
  {
    id: 'sofia-martini',
    name: 'Sofia Martini',
    category: 'Parrucchiera Donna',
    macroCategories: ['Capelli Donna'],
    city: 'Milano',
    rating: 4.8,
    reviewsCount: 128,
    description: 'Specializzata in piega, colore e acconciature eleganti.',
  },
  {
    id: 'luca-bianchi',
    name: 'Luca Bianchi',
    category: 'Barbiere',
    macroCategories: ['Capelli Uomo', 'Epilazione Uomo'],
    city: 'Napoli',
    rating: 4.9,
    reviewsCount: 96,
    description: 'Barbiere specializzato in barba, sfumature e grooming uomo.',
  },
  {
    id: 'martina-neri',
    name: 'Martina Neri',
    category: 'Estetista',
    macroCategories: ['Mani', 'Piedi', 'Viso', 'Epilazione Donna'],
    city: 'Roma',
    rating: 4.7,
    reviewsCount: 84,
    description: 'Manicure, pedicure, trucco e trattamenti beauty a domicilio.',
  },
  {
    id: 'chiara-verdi',
    name: 'Chiara Verdi',
    category: 'Beauty Specialist',
    macroCategories: ['Mani', 'Viso'],
    city: 'Milano',
    rating: 4.9,
    reviewsCount: 67,
    description: 'Specializzata in make-up e servizi nails per eventi e cerimonie.',
  },
];

const cities = ['Tutte', 'Milano', 'Napoli', 'Roma'];
const macroCategories = [
  'Tutte',
  'Capelli Donna',
  'Capelli Uomo',
  'Epilazione Donna',
  'Epilazione Uomo',
  'Mani',
  'Piedi',
  'Viso',
];

function getInitials(fullName: string) {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <div key={i} style={{ opacity: i < Math.round(rating) ? 1 : 0.25 }}>
        <Icon name="star" size={12} color="#FF7A00" />
      </div>
    );
  }
  return stars;
}

export default function DiscoverPage({
  onOpenProfessional,
}: {
  onOpenProfessional: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tutte');
  const [selectedMacroCategory, setSelectedMacroCategory] = useState('Tutte');

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      const matchName = pro.name.toLowerCase().includes(query.toLowerCase());
      const matchCity = selectedCity === 'Tutte' || pro.city === selectedCity;
      const matchMacro =
        selectedMacroCategory === 'Tutte' ||
        pro.macroCategories.includes(selectedMacroCategory);

      return matchName && matchCity && matchMacro;
    });
  }, [query, selectedCity, selectedMacroCategory]);

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
        Scopri
      </h1>

      <p
        style={{
          color: colors.muted,
          marginTop: 8,
          textAlign: 'center',
          fontSize: 15,
        }}
      >
        Cerca per nome professionista, città o macro categoria.
      </p>

      <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
        <div>
          <div
            style={{
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 700,
              color: colors.muted,
            }}
          >
            Cerca professionista per nome
          </div>

          <div
            style={{
              height: 54,
              background: colors.card,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 14px',
              boxShadow: colors.shadow,
            }}
          >
            <Icon name="search" size={18} color="#B0B0B8" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca nome professionista..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 15,
                color: colors.text,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div
              style={{
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 700,
                color: colors.muted,
              }}
            >
              Filtra per città
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={styles.select}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              style={{
                marginBottom: 8,
                fontSize: 13,
                fontWeight: 700,
                color: colors.muted,
              }}
            >
              Filtra categoria
            </div>

            <select
              value={selectedMacroCategory}
              onChange={(e) => setSelectedMacroCategory(e.target.value)}
              style={styles.select}
            >
              {macroCategories.map((macro) => (
                <option key={macro} value={macro}>
                  {macro}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
        {filteredProfessionals.map((pro) => (
          <button
            key={pro.id}
            onClick={() => onOpenProfessional(pro.id)}
            style={{
              border: 'none',
              textAlign: 'left',
              background: colors.card,
              borderRadius: 26,
              padding: 16,
              boxShadow: colors.shadow,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', gap: 14 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 22,
                  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {getInitials(pro.name)}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 17,
                    color: colors.text,
                  }}
                >
                  {pro.name}
                </div>

                <div
                  style={{
                    color: '#FF6A00',
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  {pro.category}
                </div>

                <div
                  style={{
                    color: colors.muted,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  {pro.city}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    marginTop: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {renderStars(pro.rating)}
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 13,
                      color: colors.muted,
                    }}
                  >
                    {pro.rating} ({pro.reviewsCount})
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                color: '#676770',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {pro.description}
            </div>
          </button>
        ))}

        {filteredProfessionals.length === 0 && (
          <div
            style={{
              background: colors.card,
              borderRadius: 22,
              padding: 18,
              boxShadow: colors.shadow,
              textAlign: 'center',
              color: colors.muted,
            }}
          >
            Nessun professionista trovato con questi filtri.
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    border: 'none',
    outline: 'none',
    padding: '0 12px',
    background: colors.card,
    boxShadow: colors.shadow,
    fontSize: 14,
    color: colors.text,
  },
};