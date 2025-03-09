
import { useState, useEffect } from 'react';
import { Habit } from '@/lib/habitTypes';
import { fetchHabits } from '@/lib/api/habitCrudAPI';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabitsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchHabits(false); // Exclude archived habits by default
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
    fetchHabitsData();
  }, []);

  return {
    habits,
    loading,
    error,
    refreshHabits: fetchHabitsData
  };
}
