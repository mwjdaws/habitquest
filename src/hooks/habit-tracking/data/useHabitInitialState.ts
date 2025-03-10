
import { useMemo } from "react";
import { HabitTrackingState } from "../types";

/**
 * Hook to provide the initial state for habit tracking
 * Extracted to its own hook for better modularity and testability
 */
export function useHabitInitialState(): HabitTrackingState {
  return useMemo(() => ({
    habits: [],
    filteredHabits: [],
    completions: [],
    failures: [],
    loading: true,
    error: null,
    isInitialized: false
  }), []);
}
