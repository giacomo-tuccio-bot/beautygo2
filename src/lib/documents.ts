import { supabase } from './supabase';

export type ProfessionalStoredDocument = {
  id: string;
  professional_id: string;
  document_type: string;
  file_path: string;
  file_name: string | null;
  mime_type: string | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  rejection_reason?: string | null;
  created_at?: string | null;
};

export async function uploadProfessionalDocument({
  professionalId,
  file,
  bucket,
  documentType,
}: {
  professionalId: string;
  file: File;
  bucket: 'documents' | 'portfolio';
  documentType: string;
}) {
  const extension = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const filePath = `${professionalId}/${documentType}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (uploadError) throw uploadError;

  const status = bucket === 'portfolio' ? 'approved' : 'pending';

  const { data, error } = await supabase
    .from('professional_documents')
    .insert({
      professional_id: professionalId,
      document_type: documentType,
      file_path: filePath,
      file_name: file.name,
      mime_type: file.type || null,
      status,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ProfessionalStoredDocument;
}

export async function listProfessionalDocuments(professionalId: string) {
  const { data, error } = await supabase
    .from('professional_documents')
    .select('*')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProfessionalStoredDocument[];
}

export async function removeProfessionalDocument({
  documentId,
  filePath,
  bucket,
}: {
  documentId: string;
  filePath: string;
  bucket: 'documents' | 'portfolio';
}) {
  const { error: storageError } = await supabase.storage.from(bucket).remove([filePath]);
  if (storageError) throw storageError;

  const { error } = await supabase.from('professional_documents').delete().eq('id', documentId);
  if (error) throw error;
}
