import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { generateDurationOptions } from '../../lib/timeSlots';
import type { ServiceRecord } from '../../lib/onboarding';

type CatalogRecord = {
  id: string;
  name: string;
  category: string | null;
  default_duration: number | null;
};

export default function ServicesStep({
  professionalId,
  onChange,
}: {
  professionalId: string;
  onChange?: (services: ServiceRecord[]) => void;
}) {
  const [catalog, setCatalog] = useState<CatalogRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    catalog_id: '',
    description: '',
    duration_minutes: 30,
    price: '',
  });

  const durationOptions = useMemo(() => generateDurationOptions(10, 240, 10), []);

  const loadAll = async () => {
    const [{ data: catalogRows, error: catalogError }, { data: serviceRows, error: serviceError }] =
      await Promise.all([
        supabase.from('service_catalog').select('*').order('category').order('name'),
        supabase
          .from('professional_services')
          .select('*')
          .eq('professional_id', professionalId)
          .eq('is_active', true)
          .order('created_at', { ascending: true }),
      ]);

    if (catalogError) throw catalogError;
    if (serviceError) throw serviceError;

    const nextServices = (serviceRows ?? []) as ServiceRecord[];
    setCatalog((catalogRows ?? []) as CatalogRecord[]);
    setServices(nextServices);
    onChange?.(nextServices);
  };

  useEffect(() => {
    void loadAll();
  }, [professionalId]);

  const selectedCatalog = catalog.find((item) => item.id === form.catalog_id);

  const handleAddService = async () => {
    if (!selectedCatalog) {
      alert('Seleziona un servizio dal catalogo.');
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert('Inserisci un prezzo valido.');
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.from('professional_services').insert({
        professional_id: professionalId,
        catalog_id: selectedCatalog.id,
        name: selectedCatalog.name,
        category: selectedCatalog.category,
        description: form.description.trim() || null,
        duration_minutes: Number(form.duration_minutes),
        price: Number(form.price),
        status: 'draft',
        is_active: true,
      });

      if (error) throw error;

      setForm({
        catalog_id: '',
        description: '',
        duration_minutes: 30,
        price: '',
      });

      await loadAll();
    } catch (error: any) {
      alert(error?.message || 'Errore durante il salvataggio del servizio.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitForReview = async () => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from('professional_services')
        .update({ status: 'pending' })
        .eq('professional_id', professionalId)
        .eq('is_active', true);

      if (error) throw error;
      await loadAll();
    } catch (error: any) {
      alert(error?.message || 'Errore durante l\'invio in revisione.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (serviceId: string) => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from('professional_services')
        .update({ is_active: false })
        .eq('id', serviceId)
        .eq('professional_id', professionalId);

      if (error) throw error;
      await loadAll();
    } catch (error: any) {
      alert(error?.message || 'Errore durante la rimozione del servizio.');
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = services.length > 0 && !services.some((service) => service.status === 'pending');

  return (
    <div style={card}>
      <div>
        <div style={sectionTitle}>Step 3 · Servizi</div>
        <div style={mutedText}>Servizi presi dal catalogo. Durata impostabile a step di 10 minuti.</div>
      </div>

      <div style={grid2}>
        <label style={field}>
          <span style={labelStyle}>Servizio da catalogo</span>
          <select
            style={inputStyle}
            value={form.catalog_id}
            onChange={(event) => {
              const selected = catalog.find((item) => item.id === event.target.value);
              setForm((prev) => ({
                ...prev,
                catalog_id: event.target.value,
                duration_minutes: selected?.default_duration || 30,
              }));
            }}
          >
            <option value="">Seleziona servizio</option>
            {catalog.map((item) => (
              <option key={item.id} value={item.id}>
                {item.category ? `${item.category} · ${item.name}` : item.name}
              </option>
            ))}
          </select>
        </label>

        <label style={field}>
          <span style={labelStyle}>Prezzo (€)</span>
          <input
            type="number"
            min="1"
            step="1"
            style={inputStyle}
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          />
        </label>

        <label style={field}>
          <span style={labelStyle}>Durata</span>
          <select
            style={inputStyle}
            value={form.duration_minutes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, duration_minutes: Number(event.target.value) }))
            }
          >
            {durationOptions.map((value) => (
              <option key={value} value={value}>
                {value} min
              </option>
            ))}
          </select>
        </label>

        <label style={field}>
          <span style={labelStyle}>Descrizione</span>
          <input
            style={inputStyle}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={primaryButton} disabled={busy} onClick={() => void handleAddService()}>
          Aggiungi servizio
        </button>
        <button style={secondaryButton} disabled={busy || !canSubmit} onClick={() => void handleSubmitForReview()}>
          Invia in revisione
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Servizio</th>
              <th style={th}>Categoria</th>
              <th style={th}>Durata</th>
              <th style={th}>Prezzo</th>
              <th style={th}>Stato</th>
              <th style={th}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td style={emptyCell} colSpan={6}>
                  Nessun servizio aggiunto.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td style={td}>{service.name}</td>
                  <td style={td}>{service.category || '-'}</td>
                  <td style={td}>{service.duration_minutes || '-'} min</td>
                  <td style={td}>€ {service.price || '-'}</td>
                  <td style={td}>{service.status || 'draft'}</td>
                  <td style={td}>
                    <button style={ghostButton} disabled={busy} onClick={() => void handleRemove(service.id)}>
                      Rimuovi
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  display: 'grid',
  gap: 14,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
};

const mutedText: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 14,
  marginTop: 4,
};

const grid2: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const field: React.CSSProperties = {
  display: 'grid',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 48,
  borderRadius: 16,
  border: '1px solid #E7D9CD',
  padding: '0 14px',
  boxSizing: 'border-box',
  fontSize: 14,
  background: '#fff',
};

const primaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryButton: React.CSSProperties = {
  border: '1px solid #F1D7C4',
  borderRadius: 16,
  padding: '14px 18px',
  background: '#FFF3E8',
  color: '#D35400',
  fontWeight: 800,
  cursor: 'pointer',
};

const ghostButton: React.CSSProperties = {
  border: '1px solid #E7D9CD',
  borderRadius: 12,
  padding: '10px 12px',
  background: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const th: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #F1E4D8',
  padding: '10px 8px',
  fontSize: 13,
};

const td: React.CSSProperties = {
  borderBottom: '1px solid #F8EDE5',
  padding: '12px 8px',
  fontSize: 14,
};

const emptyCell: React.CSSProperties = {
  padding: '16px 8px',
  color: '#6B7280',
};
