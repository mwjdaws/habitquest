
import { useState, useCallback, useMemo, useEffect } from "react";
import { HabitTrackingState } from "../types";
import { useHabitFiltering } from "../useHabitFiltering";
import { useHabitStateUpdate } from "../utils/useHabitStateUpdate";
import { useHabitInitialState } from "./useHabitInitialState";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to manage habit tracking state with optimized update functions
 */
export function useHabitStateManager() {
  const { user } = useAuth();
  // Get initial state from a dedicated hook
  const initialState = useHabitInitialState();
  
  // Create state with setState reference
  const [stateInternal, setStateInternal] = useState<Omit<HabitTrackingState, 'setState'>>(initialState);
  
  // Create a self-referencing state object that includes the setState function
  const state = useMemo(() => {
    return {
      ...stateInternal,
      setState: setStateInternal
    } as HabitTrackingState;
  }, [stateInternal]);
  
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
  
  // Force initialization of state if not already initialized
  useEffect(() => {
    if (!state.isInitialized && !state.loading) {
      console.log("Initializing habit state in useHabitStateManager");
      setStateInternal(prev => ({
        ...prev,
        isInitialized: true
      }));
    }
  }, [state.isInitialized, state.loading]);
  
  // Update habits with filtering
  const updateHabits = useCallback((habits: any[]) => {
    // Skip if no user is authenticated
    if (!user) {
      console.log("Skipping updateHabits - user not authenticated");
      return;
    }
    
    // Make sure habits is always an array
    const habitsArray = Array.isArray(habits) ? habits : [];
    const filteredHabits = filterHabitsForToday(habitsArray);
    
    setStateInternal(prev => ({
      ...prev,
      habits: habitsArray,
      filteredHabits,
      isInitialized: true,
      loading: false,
      error: null
    }));
  }, [filterHabitsForToday, user]);
  
  // Wrapper for setLoading to update the state
  const handleSetLoading = useCallback((loading: boolean) => {
    setStateInternal(prev => ({
      ...prev,
      loading
    }));
  }, []);

  // Wrapper for setError to update the state
  const handleSetError = useCallback((error: string | null) => {
    setStateInternal(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);
  
  // Wrapper for resetState to update the state
  const handleResetState = useCallback(() => {
    setStateInternal(initialState);
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
    setState: setStateInternal,
    ...stateUpdaters
  }), [state, stateUpdaters]);
}
