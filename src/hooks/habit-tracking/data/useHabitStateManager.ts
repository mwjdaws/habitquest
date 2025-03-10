
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
  
  // Get state updaters
  const { 
    addHabit, 
    completeHabit, 
    failHabit, 
    setLoading, 
    setError, 
    initializeState, 
    resetState 
  } = useHabitStateUpdate();
  
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
  
  // Wrapper for setLoading to update the state
  const handleSetLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading
    }));
  }, []);

  // Wrapper for setError to update the state
  const handleSetError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error
    }));
  }, []);
  
  // Wrapper for resetState to update the state
  const handleResetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  // Combine all state updaters
  const stateUpdaters = useMemo(() => ({
    addHabit,
    completeHabit,
    failHabit,
    updateHabits,
    setLoading: handleSetLoading,
    setError: handleSetError,
    resetState: handleResetState
  }), [
    addHabit, 
    completeHabit, 
    failHabit, 
    updateHabits, 
    handleSetLoading, 
    handleSetError, 
    handleResetState
  ]);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    state,
    setState,
    ...stateUpdaters
  }), [state, stateUpdaters]);
}
