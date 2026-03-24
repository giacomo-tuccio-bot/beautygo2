import { useEffect, useState } from 'react';
import {
  listProfessionalDocuments,
  removeProfessionalDocument,
  uploadProfessionalDocument,
  type ProfessionalStoredDocument,
} from '../../lib/documents';

const requiredDocs = [
  { key: 'identity_front', label: 'Documento identità fronte' },
  { key: 'identity_back', label: 'Documento identità retro' },
  { key: 'tax_verification', label: 'Verifica CF / P.IVA' },
  { key: 'cv', label: 'Curriculum Vitae' },
];

export default function DocumentsStep({
  professionalId,
  onChange,
}: {
  professionalId: string;
  onChange?: (documents: ProfessionalStoredDocument[]) => void;
}) {
  const [documents, setDocuments] = useState<ProfessionalStoredDocument[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const rows = await listProfessionalDocuments(professionalId);
    setDocuments(rows);
    onChange?.(rows);
  };

  useEffect(() => {
    void refresh();
  }, [professionalId]);

  const handleUpload = async (
    file: File,
    documentType: string,
    bucket: 'documents' | 'portfolio'
  ) => {
    setBusy(true);
    try {
      await uploadProfessionalDocument({ professionalId, file, documentType, bucket });
      await refresh();
    } catch (error: any) {
      alert(error?.message || 'Errore durante il caricamento del file.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (doc: ProfessionalStoredDocument) => {
    setBusy(true);
    try {
      await removeProfessionalDocument({
        documentId: doc.id,
        filePath: doc.file_path,
        bucket: doc.document_type.startsWith('portfolio_') ? 'portfolio' : 'documents',
      });
      await refresh();
    } catch (error: any) {
      alert(error?.message || 'Errore durante l\'eliminazione del file.');
    } finally {
      setBusy(false);
    }
  };

  const portfolioDocs = documents.filter((doc) => doc.document_type.startsWith('portfolio_'));

  return (
    <div style={card}>
      <div>
        <div style={sectionTitle}>Step 5 · Documenti</div>
        <div style={mutedText}>
          Carica i documenti per la verifica, il CV e alcune foto dei lavori svolti.
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {requiredDocs.map((item) => {
          const existing = documents.find((doc) => doc.document_type === item.key);

          return (
            <div key={item.key} style={itemCard}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.label}</div>
                <div style={smallMutedText}>
                  {existing ? `Caricato: ${existing.file_name || 'file'}` : 'Non caricato'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {existing && <span style={{ ...badge, ...statusStyle(existing.status) }}>{labelForStatus(existing.status)}</span>}
                <label style={primaryButtonLabel}>
                  {existing ? 'Sostituisci' : 'Carica file'}
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleUpload(file, item.key, 'documents');
                      }
                    }}
                  />
                </label>
                {existing && (
                  <button style={ghostButton} disabled={busy} onClick={() => void handleDelete(existing)}>
                    Elimina
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={itemCard}>
        <div>
          <div style={{ fontWeight: 700 }}>Portfolio lavori</div>
          <div style={smallMutedText}>Carica una o più foto dei tuoi lavori.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={darkButtonLabel}>
            Aggiungi foto
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              disabled={busy}
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                files.forEach((file, index) => {
                  void handleUpload(file, `portfolio_${Date.now()}_${index}`, 'portfolio');
                });
              }}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {portfolioDocs.length === 0 ? (
            <div style={smallMutedText}>Nessuna foto caricata.</div>
          ) : (
            portfolioDocs.map((doc) => (
              <div key={doc.id} style={portfolioRow}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.file_name || 'Foto portfolio'}</span>
                <button style={ghostButton} disabled={busy} onClick={() => void handleDelete(doc)}>
                  Elimina
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {busy && <div style={smallMutedText}>Operazione in corso...</div>}
    </div>
  );
}

function labelForStatus(status?: string | null) {
  switch (status) {
    case 'approved':
      return 'Approvato';
    case 'rejected':
      return 'Rifiutato';
    default:
      return 'In revisione';
  }
}

function statusStyle(status?: string | null) {
  switch (status) {
    case 'approved':
      return { background: '#DCFCE7', color: '#166534' };
    case 'rejected':
      return { background: '#FEE2E2', color: '#B91C1C' };
    default:
      return { background: '#FEF3C7', color: '#B45309' };
  }
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  display: 'grid',
  gap: 14,
};

const itemCard: React.CSSProperties = {
  borderRadius: 18,
  border: '1px solid #F1E4D8',
  padding: 14,
  display: 'grid',
  gap: 12,
};

const portfolioRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  borderRadius: 12,
  background: '#FFF9F4',
  padding: '10px 12px',
};

const badge: React.CSSProperties = {
  borderRadius: 999,
  padding: '6px 10px',
  fontSize: 12,
  fontWeight: 800,
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

const primaryButtonLabel: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: '10px 12px',
  background: 'linear-gradient(135deg, #FF8A1F, #FF5A00)',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
};

const darkButtonLabel: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: '10px 12px',
  background: '#111827',
  color: '#fff',
  fontWeight: 700,
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
