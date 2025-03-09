
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/lib/habitTypes';
import { fetchHabits } from '@/lib/api/habitCrudAPI';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchHabitsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('useHabits: Fetching habits data...');
      const data = await fetchHabits(false); // Exclude archived habits by default
      console.log(`useHabits: Fetched ${data.length} habits`);
      setHabits(data || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Force a refresh by incrementing the refresh trigger
  const refreshHabits = useCallback(() => {
    console.log('useHabits: Triggering refresh');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load habits on component mount or when refreshTrigger changes
  useEffect(() => {
    console.log(`useHabits: refreshTrigger changed to ${refreshTrigger}, fetching habits`);
    fetchHabitsData();
  }, [fetchHabitsData, refreshTrigger]);

  return {
    habits,
    loading,
    error,
    refreshHabits
  };
}
