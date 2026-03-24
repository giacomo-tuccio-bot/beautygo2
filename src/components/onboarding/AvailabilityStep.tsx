import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { generateTimeSlots, isEndAfterStart } from '../../lib/timeSlots';
import type { AvailabilityRecord } from '../../lib/onboarding';

const days = [
  { value: 1, label: 'Lunedì' },
  { value: 2, label: 'Martedì' },
  { value: 3, label: 'Mercoledì' },
  { value: 4, label: 'Giovedì' },
  { value: 5, label: 'Venerdì' },
  { value: 6, label: 'Sabato' },
  { value: 7, label: 'Domenica' },
];

export default function AvailabilityStep({
  professionalId,
  onChange,
}: {
  professionalId: string;
  onChange?: (availability: AvailabilityRecord[]) => void;
}) {
  const [rows, setRows] = useState<AvailabilityRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    weekday: 1,
    start_time: '09:00',
    end_time: '13:00',
  });

  const timeSlots = useMemo(() => generateTimeSlots(15), []);

  const loadRows = async () => {
    const { data, error } = await supabase
      .from('professional_availability')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('is_active', true)
      .order('weekday', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;

    const nextRows = (data ?? []) as AvailabilityRecord[];
    setRows(nextRows);
    onChange?.(nextRows);
  };

  useEffect(() => {
    void loadRows();
  }, [professionalId]);

  const handleAddSlot = async () => {
    if (!isEndAfterStart(form.start_time, form.end_time)) {
      alert("L'orario di fine deve essere successivo a quello di inizio.");
      return;
    }

    const sameDaySlots = rows
      .filter((row) => row.weekday === form.weekday)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    const overlaps = sameDaySlots.some(
      (slot) => !(form.end_time <= slot.start_time || form.start_time >= slot.end_time)
    );

    if (overlaps) {
      alert('Questa fascia si sovrappone a una fascia già presente.');
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.from('professional_availability').insert({
        professional_id: professionalId,
        weekday: form.weekday,
        start_time: form.start_time,
        end_time: form.end_time,
        is_active: true,
      });

      if (error) throw error;
      await loadRows();
    } catch (error: any) {
      alert(error?.message || 'Errore durante il salvataggio della fascia oraria.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from('professional_availability')
        .update({ is_active: false })
        .eq('id', id)
        .eq('professional_id', professionalId);

      if (error) throw error;
      await loadRows();
    } catch (error: any) {
      alert(error?.message || 'Errore durante la rimozione della fascia.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={card}>
      <div>
        <div style={sectionTitle}>Step 4 · Disponibilità</div>
        <div style={mutedText}>Puoi inserire più fasce nello stesso giorno, con step di 15 minuti.</div>
      </div>

      <div style={grid3}>
        <label style={field}>
          <span style={labelStyle}>Giorno</span>
          <select
            style={inputStyle}
            value={form.weekday}
            onChange={(event) => setForm((prev) => ({ ...prev, weekday: Number(event.target.value) }))}
          >
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </label>

        <label style={field}>
          <span style={labelStyle}>Da</span>
          <select
            style={inputStyle}
            value={form.start_time}
            onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <label style={field}>
          <span style={labelStyle}>A</span>
          <select
            style={inputStyle}
            value={form.end_time}
            onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <button style={primaryButton} disabled={busy} onClick={() => void handleAddSlot()}>
          Aggiungi fascia oraria
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {days.map((day) => {
          const slots = rows.filter((row) => row.weekday === day.value);
          return (
            <div key={day.value} style={dayCard}>
              <div style={{ fontWeight: 700 }}>{day.label}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {slots.length === 0 ? (
                  <span style={smallMutedText}>Nessuna fascia inserita</span>
                ) : (
                  slots.map((slot) => (
                    <div key={slot.id} style={slotBadge}>
                      <span>
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </span>
                      <button style={removeLink} disabled={busy} onClick={() => void handleDelete(slot.id)}>
                        rimuovi
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
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

const smallMutedText: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 13,
};

const grid3: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
};

const field: React.CSSProperties = { display: 'grid', gap: 6 };

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

const dayCard: React.CSSProperties = {
  borderRadius: 18,
  border: '1px solid #F1E4D8',
  padding: 14,
};

const slotBadge: React.CSSProperties = {
  borderRadius: 999,
  padding: '8px 10px',
  background: '#FFF3E8',
  color: '#D35400',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const removeLink: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#B91C1C',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
