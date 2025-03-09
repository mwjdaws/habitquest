
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/lib/habitTypes';
import { fetchHabits } from '@/lib/api/habit';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchHabitsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchHabits(false);
      setHabits(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Force a refresh by incrementing the refresh trigger
  const refreshHabits = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load habits on component mount or when refreshTrigger changes
  useEffect(() => {
    fetchHabitsData();
  }, [fetchHabitsData, refreshTrigger]);

  return { habits, loading, error, refreshHabits };
}
