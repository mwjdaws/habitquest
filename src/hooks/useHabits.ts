
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/lib/habitTypes';
import { fetchHabits } from '@/lib/api/habit';
import { useLoadingError } from './useLoadingError';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { loading, error, handleLoading } = useLoadingError();

  const fetchHabitsData = useCallback(async () => {
    try {
      const data = await handleLoading(fetchHabits(false));
      setHabits(data || []);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to fetch habits:', err);
    }
  }, [handleLoading]);

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
