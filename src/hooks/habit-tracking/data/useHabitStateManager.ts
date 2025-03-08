
import { useState, useCallback } from "react";
import { HabitTrackingState } from "../types";
import { useHabitFiltering } from "../useHabitFiltering";

/**
 * Hook to manage habit tracking state
 */
export function useHabitStateManager() {
  const [state, setState] = useState<HabitTrackingState>({
    habits: [],
    filteredHabits: [],
    completions: [],
    failures: [],
    loading: true,
    error: null,
    isInitialized: false
  });
  
  const { filterHabitsForToday } = useHabitFiltering();
  
  // Update state with new data
  const updateState = useCallback((updates: Partial<HabitTrackingState>) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);
  
  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);
  
  // Update habits with filtering
  const updateHabits = useCallback((habits: any[]) => {
    const filteredHabits = filterHabitsForToday(habits);
    
    setState(prev => ({
      ...prev,
      habits,
      filteredHabits,
      isInitialized: true,
      loading: false,
      error: null
    }));
  }, [filterHabitsForToday]);
  
  return {
    state,
    setState,
    updateState,
    setLoading,
    setError,
    updateHabits
  };
}
