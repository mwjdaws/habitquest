
import { useCallback } from "react";
import { HabitTrackingState } from "../types";
import { useStateUpdaters } from "./utils/useStateUpdaters";

/**
 * Hook for optimized habit state update functions that extends common updaters
 * with habit-specific functionality
 * 
 * This hook builds on the base state updaters and adds specialized functions
 * needed for habit tracking operations.
 *
 * @param {React.Dispatch<React.SetStateAction<HabitTrackingState>>} setState - State setter function
 * @returns {Object} Collection of state update functions specialized for habit tracking
 * 
 * @example
 * const stateUpdaters = useHabitStateUpdate(setState);
 * // Later: stateUpdaters.updateCompletions(newCompletions);
 */
export function useHabitStateUpdate(setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>) {
  // Get common state updaters
  const commonUpdaters = useStateUpdaters(setState);
  
  // Return the common updaters plus any habit-specific updaters
  return {
    ...commonUpdaters
    // Additional habit-specific updaters can be added here as needed
  };
}
