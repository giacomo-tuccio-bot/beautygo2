GUIDA AUTH BEAUTYGO

FLUSSO SCELTO
1. Cliente e professionista si registrano con email + password.
2. Durante la registrazione ricevono un codice email.
3. Inseriscono il codice dentro l'app nella pagina "Verifica email".
4. Dopo la verifica usano sempre email + password per i login successivi.
5. L'admin viene creato da Supabase e usa direttamente email + password.

CONFIGURAZIONE SUPABASE
1. Authentication > Sign In / Providers
- Allow new users to sign up: ON
- Confirm email: ON
- Email provider: ON

2. Authentication > Email Templates > Confirm signup
Usa un template con il token, non il link:

<h2>Verifica email</h2>
<p>Il tuo codice di verifica è:</p>
<h1>{{ .Token }}</h1>
<p>Inserisci questo codice nell'app per completare la registrazione.</p>

LOGIN
- Tutti gli utenti, incluso admin, entrano con email + password.
- L'admin deve esistere in Authentication > Users e avere role = admin in profiles.
