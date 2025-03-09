
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Habit } from '@/lib/habitTypes';
import { fetchHabits } from '@/lib/api/habit';
import { useLoadingError } from './useLoadingError';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { loading, error, handleLoading } = useLoadingError();
  
  // Cache duration in milliseconds (30 seconds)
  const CACHE_DURATION = 30000;

  const fetchHabitsData = useCallback(async (forceRefresh = false) => {
    try {
      // Only fetch if cache is expired or force refresh is requested
      const now = Date.now();
      if (forceRefresh || now - lastFetchTime > CACHE_DURATION) {
        console.log("Fetching habits: cache expired or force refresh requested");
        const data = await handleLoading(fetchHabits(false));
        setHabits(data || []);
        setLastFetchTime(now);
      } else {
        console.log("Using cached habits data, age:", Math.round((now - lastFetchTime)/1000), "seconds");
      }
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to fetch habits:', err);
    }
  }, [handleLoading, lastFetchTime]);

  // Force a refresh by incrementing the refresh trigger and resetting cache
  const refreshHabits = useCallback((forceRefresh = true) => {
    if (forceRefresh) {
      setLastFetchTime(0); // Reset cache
    }
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load habits on component mount or when refreshTrigger changes
  useEffect(() => {
    fetchHabitsData(refreshTrigger > 0);
  }, [fetchHabitsData, refreshTrigger]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({ 
    habits, 
    loading, 
    error, 
    refreshHabits,
    fetchHabitsData
  }), [habits, loading, error, refreshHabits, fetchHabitsData]);
}
