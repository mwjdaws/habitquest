
import { useState, useCallback, useMemo } from "react";
import { HabitTrackingState } from "../types";
import { useHabitFiltering } from "../useHabitFiltering";
import { useHabitStateUpdate } from "../utils/useHabitStateUpdate";
import { useHabitInitialState } from "./useHabitInitialState";

/**
 * Hook to manage habit tracking state with optimized update functions
 */
export function useHabitStateManager() {
  // Get initial state from a dedicated hook
  const initialState = useHabitInitialState();
  const [state, setState] = useState<HabitTrackingState>(initialState);
  
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
  
  // Encapsulate state update functions in a separate object
  const stateUpdaters = useMemo(() => ({
    updateHabits,
    setLoading,
    setError,
    
    // Add a new convenient function to update completions
    updateCompletions: (completions: any[]) => {
      setState(prev => ({
        ...prev,
        completions,
        loading: false
      }));
    },
    
    // Add a new convenient function to update failures
    updateFailures: (failures: any[]) => {
      setState(prev => ({
        ...prev,
        failures,
        loading: false
      }));
    },
    
    // Reset state function
    resetState: () => setState(initialState)
  }), [updateHabits, setLoading, setError, initialState]);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    state,
    setState,
    ...stateUpdaters
  }), [state, stateUpdaters]);
}
