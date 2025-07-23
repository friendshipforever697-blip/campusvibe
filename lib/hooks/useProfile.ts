import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/hooks/supabase';
import { Session } from '@supabase/supabase-js';
import { useFocusEffect } from '@react-navigation/native';

export const useProfile = (session: Session | null) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [session])
  );

  useEffect(() => {
    fetchProfile();
  }, [session]);

  return { profile, loading, refetch: fetchProfile };
};
