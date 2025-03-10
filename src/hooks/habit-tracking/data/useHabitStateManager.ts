
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
  const stateUpdaters = useHabitStateUpdate(setState);
  
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
  
  // Combine all state updaters
  const combinedStateUpdaters = useMemo(() => ({
    ...stateUpdaters,
    updateHabits,
    resetState: () => stateUpdaters.resetState(initialState)
  }), [stateUpdaters, updateHabits, initialState]);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    state,
    setState,
    ...combinedStateUpdaters
  }), [state, combinedStateUpdaters]);
}
