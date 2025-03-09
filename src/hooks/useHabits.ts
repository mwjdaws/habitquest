
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Habit } from '@/lib/habitTypes';
import { getAuthenticatedUser } from '@/lib/api/apiUtils';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = await getAuthenticatedUser();
      
      const { data, error: fetchError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      
      setHabits(data || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Load habits on component mount
  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    loading,
    error,
    refreshHabits: fetchHabits
  };
}
