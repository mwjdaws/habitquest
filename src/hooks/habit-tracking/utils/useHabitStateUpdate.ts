
import { useCallback } from "react";
import { HabitTrackingState } from "../types";
import { useStateUpdaters } from "./useStateUpdaters";

/**
 * Hook for optimized habit state update functions
 * 
 * This hook provides a wrapper around useStateUpdaters to centralize 
 * all habit-specific state update operations in one place.
 * 
 * @param {React.Dispatch<React.SetStateAction<HabitTrackingState>>} setState - State setter function
 * @returns {Object} Collection of memoized state update functions including habit-specific ones
 * 
 * @example
 * const { setLoading, updateCompletions } = useHabitStateUpdate(setState);
 * // Later: updateCompletions(newCompletions);
 */
export function useHabitStateUpdate(setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>) {
  // Get common state updaters
  const commonUpdaters = useStateUpdaters(setState);
  
  // Define habit-specific state updaters
  const updateFilteredHabits = useCallback((filteredHabits: any[]) => {
    setState(prev => ({
      ...prev,
      filteredHabits
    }));
  }, [setState]);
  
  // Return the common updaters plus the habit-specific updaters
  return {
    ...commonUpdaters,
    updateFilteredHabits
  };
}
