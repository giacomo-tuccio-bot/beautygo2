import { supabase } from './supabaseClient';

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
  const ext = file.name.split('.').pop() || 'bin';
  const filePath = `${professionalId}/${documentType}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { error } = await supabase.from('professional_documents').insert({
    professional_id: professionalId,
    document_type: documentType,
    file_path: filePath,
    file_name: file.name,
    mime_type: file.type,
    status: bucket === 'portfolio' ? 'approved' : 'pending',
  });

  if (error) throw error;
}

export async function listProfessionalDocuments(professionalId: string) {
  const { data, error } = await supabase
    .from('professional_documents')
    .select('*')
    .eq('professional_id', professionalId);

  if (error) throw error;
  return data || [];
}

export async function removeProfessionalDocument(
  id: string,
  path: string,
  bucket: 'documents' | 'portfolio'
) {
  await supabase.storage.from(bucket).remove([path]);
  await supabase.from('professional_documents').delete().eq('id', id);
}