import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://alwxnhrswechtxbpczcj.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsd3huaHJzd2VjaHR4YnBjemNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzIxNDksImV4cCI6MjA4OTI0ODE0OX0.2rM_XvQnQaZAzg9ltdQ-RqeMoKH27OHCmu9aZ3Of57g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'beautygo-supabase-auth',
  },
});
