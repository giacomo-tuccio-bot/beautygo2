CONFIGURAZIONE OTP EMAIL

1. In Supabase vai su Authentication > Providers > Email e lascia attivo Email provider.
2. Per ricevere il codice nella mail, usa il template email di Supabase con il token OTP.
3. Questo progetto ora usa:
   - Registrazione cliente/professionista -> signInWithOtp(... shouldCreateUser: true)
   - Login -> signInWithOtp(... shouldCreateUser: false)
   - Verifica codice -> verifyOtp({ email, token, type: 'email' })
4. Non servono redirect localhost per completare l'accesso via codice OTP.
5. Se vuoi, puoi tenere comunque URL configuration compilata, ma il flusso OTP non dipende dal click su link.
