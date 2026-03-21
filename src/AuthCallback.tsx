import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    void handleAuth();
  }, [navigate]);

  return <div>Loading...</div>;
}
