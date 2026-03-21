CONTENUTO DELLO ZIP
- vite.config.ts
- .env
- src/AuthCallback.tsx
- src/pages/RegisterCustomerPage.tsx
- src/pages/RegisterProfessionalPage.tsx
- SUPABASE_SQL_FIX.sql

COSA FARE
1. Sostituisci i file del progetto con questi.
2. Apri SUPABASE_SQL_FIX.sql e incollalo nel SQL Editor di Supabase.
3. Riavvia il progetto con npm run dev.
4. Genera una NUOVA registrazione e una NUOVA email di conferma.

NOTA
Il profilo finale viene creato dal frontend al primo accesso confermato:
pending_registrations -> profiles
Non usare più trigger su auth.users per creare profiles.
