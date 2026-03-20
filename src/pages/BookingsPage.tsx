import React, { useEffect, useMemo, useState } from 'react';
import { colors } from '../theme';

const serviceCatalog = {
  'Capelli Donna': [
    'Piega',
    'Piega con ferro',
    'Piega extension',
    'Piastra / styling veloce',
    'Taglio donna',
    'Taglio frangia',
    'Colore in olio',
    'Tonalizzante / riflessante',
    'Gloss',
    'Maschera colorante',
    'Schiaritura smart',
    'Balayage soft',
    'Pulizia colore cosmetico',
    'Raccolto',
    'Semiraccolto',
    'Trecce + piega',
    'Trecce + asciugatura',
  ],
  'Capelli Uomo': [
    'Taglio uomo',
    'Taglio razor',
    'Rifinitura barba',
    'Rasatura',
    'Trattamento barba',
  ],
  'Epilazione Donna': [
    'Gamba intera',
    'Mezza gamba',
    'Inguine',
    'Braccia',
    'Ascelle',
    'Viso (baffetti / sopracciglia / completo)',
    'Glutei',
    'Cera completa',
  ],
  'Epilazione Uomo': [
    'Schiena',
    'Petto',
    'Addome',
    'Petto + addome',
    'Gamba intera',
    'Braccia',
    'Ascelle',
    'Spalle',
    'Glutei',
  ],
  Mani: [
    'Manicure base',
    'Manicure french',
    'Semipermanente',
    'Rimozione semipermanente',
    'Copertura gel',
    'Ricostruzione unghie',
    'Nail art',
  ],
  Piedi: ['Pedicure completo', 'Pedicure + semipermanente'],
  Viso: [
    'Trattamento viso base',
    'Trattamento idratante / anti-age',
    'Trucco giorno',
    'Trucco sera',
  ],
} as const;

const macroCategories = ['Tutte', ...Object.keys(serviceCatalog)];

const macroColors: Record<string, { bg: string; color: string }> = {
  'Capelli Donna': { bg: '#FFE0EA', color: '#FF6B9D' },
  'Capelli Uomo': { bg: '#D9EBFF', color: '#1976D2' },
  'Epilazione Donna': { bg: '#FDE7D7', color: '#FF7A00' },
  'Epilazione Uomo': { bg: '#F8E3BE', color: '#FF8F00' },
  Mani: { bg: '#EADCFB', color: '#8E5BCE' },
  Piedi: { bg: '#DDEFD8', color: '#388E3C' },
  Viso: { bg: '#FFF0D9', color: '#D97A00' },
};

export default function BookingsPage({
  initialMacroCategory,
  onResetInitialMacro,
  onSearchProfessionals,
}: {
  initialMacroCategory: string;
  onResetInitialMacro: () => void;
  onSearchProfessionals: (services: string[]) => void;
}) {
  const [selectedMacro, setSelectedMacro] = useState(initialMacroCategory || 'Tutte');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('Tutti');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    setSelectedMacro(initialMacroCategory || 'Tutte');
    setSelectedServiceFilter('Tutti');
    setSelectedServices([]);
  }, [initialMacroCategory]);

  const serviceOptions = useMemo(() => {
    if (selectedMacro === 'Tutte') {
      return ['Tutti', ...Object.values(serviceCatalog).flat()];
    }
    return ['Tutti', ...serviceCatalog[selectedMacro as keyof typeof serviceCatalog]];
  }, [selectedMacro]);

  const visibleBlocks = useMemo(() => {
    return Object.entries(serviceCatalog)
      .map(([macro, services]) => {
        if (selectedMacro !== 'Tutte' && macro !== selectedMacro) return null;

        const filteredServices =
          selectedServiceFilter === 'Tutti'
            ? services
            : services.filter((service) => service === selectedServiceFilter);

        if (filteredServices.length === 0) return null;

        return { macro, services: filteredServices };
      })
      .filter(Boolean) as { macro: string; services: string[] }[];
  }, [selectedMacro, selectedServiceFilter]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const removeSelectedService = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service));
  };

  const resetFilters = () => {
    setSelectedMacro('Tutte');
    setSelectedServiceFilter('Tutti');
    setSelectedServices([]);
    onResetInitialMacro();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '18px 18px 96px',
        background:
          'radial-gradient(circle at top left, #FFE2CC 0%, #FFF1E6 30%, #F8F2EE 75%)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: colors.text }}>
        Prenota
      </h1>

      <p style={{ color: colors.muted, marginTop: 8 }}>
        Seleziona uno o più servizi e trova un professionista.
      </p>

      <div
        style={{
          position: 'sticky',
          top: 12,
          zIndex: 30,
          marginTop: 18,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderRadius: 22,
          padding: 14,
          boxShadow: colors.shadow,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: colors.muted,
            }}
          >
            Servizi selezionati
          </div>

          <button
            onClick={resetFilters}
            style={{
              border: 'none',
              borderRadius: 14,
              padding: '10px 12px',
              background: '#FFF3E8',
              color: '#FF6A00',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Elimina filtri
          </button>
        </div>

        {selectedServices.length > 0 ? (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {selectedServices.map((service) => (
              <button
                key={service}
                onClick={() => removeSelectedService(service)}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 12px',
                  background: '#FFF3E8',
                  color: '#FF6A00',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {service} ✕
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '10px 2px 4px',
              color: colors.muted,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Nessun servizio selezionato
          </div>
        )}

        <button
          onClick={() => onSearchProfessionals(selectedServices)}
          disabled={selectedServices.length === 0}
          style={{
            width: '100%',
            marginTop: 14,
            border: 'none',
            borderRadius: 16,
            padding: '13px 14px',
            background:
              selectedServices.length > 0
                ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                : '#E5E5E5',
            color: selectedServices.length > 0 ? '#fff' : '#9A9A9A',
            fontWeight: 800,
            fontSize: 15,
            cursor: selectedServices.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Cerca professionisti disponibili
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
        <div>
          <div
            style={{
              marginBottom: 8,
              fontSize: 13,
              fontWeight: 700,
              color: colors.muted,
            }}
          >
            Macro categoria
          </div>

          <select
            value={selectedMacro}
            onChange={(e) => {
              setSelectedMacro(e.target.value);
              setSelectedServiceFilter('Tutti');
            }}
            style={styles.select}
          >
            {macroCategories.map((macro) => (
              <option key={macro} value={macro}>
                {macro}
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
            Servizio specifico
          </div>

          <select
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
            style={styles.select}
          >
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 18, marginTop: 22 }}>
        {visibleBlocks.map(({ macro, services }) => {
          const palette = macroColors[macro] || { bg: '#FFF3E8', color: '#FF7A00' };

          return (
            <div
              key={macro}
              style={{
                background: colors.card,
                borderRadius: 24,
                padding: 16,
                boxShadow: colors.shadow,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  background: palette.bg,
                  color: palette.color,
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 14,
                }}
              >
                {macro}
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {services.map((item) => {
                  const active = selectedServices.includes(item);

                  return (
                    <button
                      key={item}
                      onClick={() => toggleService(item)}
                      style={{
                        border: 'none',
                        background: active
                          ? 'linear-gradient(135deg, #FF8A1F, #FF5A00)'
                          : palette.bg,
                        color: active ? '#fff' : colors.text,
                        borderRadius: 16,
                        padding: '14px 14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {active ? '✓ ' : ''}{item}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
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