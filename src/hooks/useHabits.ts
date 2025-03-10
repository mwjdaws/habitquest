
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Habit } from '@/lib/habitTypes';
import { useHabitFetcher } from './habit-tracking/data/useHabitFetcher';
import { useLoadingError } from './useLoadingError';

/**
 * Hook for managing habits data with optimized fetching and caching
 */
export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { loading, error, setLoading, setError } = useLoadingError();
  const mountedRef = useRef(true);
  const dataFetchedRef = useRef(false);
  
  // Use the more robust implementation from useHabitFetcher
  const { loadData, clearCache } = useHabitFetcher();
  
  // Fetch habits with robust error handling and caching
  const fetchHabitsData = useCallback(async (forceRefresh = false) => {
    // Skip if already fetching data or if not a force refresh and data already loaded
    if (loading && !forceRefresh) return;
    if (!forceRefresh && dataFetchedRef.current) return;
    
    try {
      setLoading(true);
      
      // Use the advanced loadData function that handles caching and cancellation
      const result = await loadData(true, forceRefresh);
      
      // Prevent state updates if component unmounted
      if (!mountedRef.current) return;
      
      if (result && !result.error) {
        setHabits(result.habits || []);
        setError(null);
        dataFetchedRef.current = true;
      } else if (result?.error) {
        setError(new Error(result.error));
      }
    } catch (err) {
      console.error('Failed to fetch habits:', err);
      
      // Prevent state updates if component unmounted
      if (!mountedRef.current) return;
      
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      // Prevent state updates if component unmounted
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadData, setLoading, setError, loading]);

  // Force a refresh by incrementing the refresh trigger
  const refreshHabits = useCallback((forceRefresh = true) => {
    if (forceRefresh) {
      clearCache(); // Reset cache through the habit fetcher
      dataFetchedRef.current = false;
    }
    setRefreshTrigger(prev => prev + 1);
  }, [clearCache]);

  // Load habits on component mount or when refreshTrigger changes
  useEffect(() => {
    fetchHabitsData(refreshTrigger > 0);
    
    // Set mounted ref to false on cleanup
    return () => {
      mountedRef.current = false;
    };
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
