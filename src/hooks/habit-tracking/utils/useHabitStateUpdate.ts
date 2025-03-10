
import { useCallback } from "react";
import { HabitTrackingState } from "../types";
import { useStateUpdaters } from "./useStateUpdaters";

/**
 * Hook for optimized habit state update functions
 */
export function useHabitStateUpdate(setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>) {
  // Get common state updaters
  const commonUpdaters = useStateUpdaters(setState);
  
  // Return the common updaters plus any habit-specific updaters
  return {
    ...commonUpdaters
  };
}
