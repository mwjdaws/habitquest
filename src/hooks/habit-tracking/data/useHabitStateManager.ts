
import { useState, useCallback } from "react";
import { HabitTrackingState } from "../types";
import { useHabitFiltering } from "../useHabitFiltering";
import { useHabitStateUpdate } from "../utils/useHabitStateUpdate";

/**
 * Hook to manage habit tracking state with optimized update functions
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
  const { setLoading, setError } = useHabitStateUpdate(setState);
  
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
    updateHabits,
    setLoading,
    setError
  };
}
