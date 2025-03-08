
import { useCallback } from "react";
import { Habit } from "@/lib/habitTypes";
import { HabitTrackingState } from "../types";

/**
 * Hook to provide a memoized habit finding utility function
 */
export function useHabitFinder(state: HabitTrackingState) {
  // Find habit by ID utility (memoized internally)
  const findHabit = useCallback((habitId: string): Habit | undefined => {
    return state.habits.find(h => h.id === habitId) || 
           state.filteredHabits.find(h => h.id === habitId);
  }, [state.habits, state.filteredHabits]);

  return findHabit;
}
