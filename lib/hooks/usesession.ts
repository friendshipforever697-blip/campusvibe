import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndCreateProfile = async () => {
      const { data, error } = await supabase.auth.getSession();
      const userSession = data?.session;
      setSession(userSession);

      if (userSession?.user) {
        const { id, email } = userSession.user;

        // Check if profile already exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', id);

        if (fetchError) {
          console.error('Error checking profile:', fetchError.message);
        }

        if (!existingProfile || existingProfile.length === 0) {
          // Create profile
          const { error: insertError } = await supabase.from('profiles').insert([
            {
              id,
              email,
              full_name: '',
              username: '',
              college: '',
              branch: '',
              year: '',
              bio: '',
              avatar_url: '',
            },
          ]);

          if (insertError) {
            console.error('Error inserting new profile:', insertError.message);
          } else {
            console.log('✅ New profile created');
          }
        }
      }

      setLoading(false);
    };

    getSessionAndCreateProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};
