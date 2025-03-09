
import { useMemo, useCallback } from "react";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { HabitTrackingResult } from "./types";

/**
 * Primary hook for habit tracking functionality that combines data and actions
 * with improved performance optimizations
 */
export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { state, setState, refreshData } = useHabitData(onHabitChange);
  
  // Memoize action handlers to prevent unnecessary re-creations
  const { 
    handleToggleCompletion, 
    handleLogFailure,
    handleUndoFailure
  } = useHabitActions(state, setState, refreshData);

  // Calculate UI metrics once per render with memoization
  const derivedValues = useMemo(() => {
    const totalCount = state.filteredHabits.length;
    const completedCount = state.filteredHabits.filter(habit => 
      state.completions.some(c => c.habit_id === habit.id)
    ).length;
    
    const progress = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;
    
    return {
      totalCount,
      completedCount,
      progress
    };
  }, [state.filteredHabits, state.completions]);

  // Use memo to create a stable object return value to prevent unnecessary re-renders
  return useMemo(() => ({
    habits: state.filteredHabits,
    completions: state.completions,
    failures: state.failures,
    loading: state.loading,
    error: state.error,
    progress: derivedValues.progress,
    completedCount: derivedValues.completedCount,
    totalCount: derivedValues.totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData,
    isInitialized: state.isInitialized
  }), [
    state.filteredHabits,
    state.completions,
    state.failures,
    state.loading,
    state.error,
    state.isInitialized,
    derivedValues.progress,
    derivedValues.completedCount,
    derivedValues.totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData
  ]);
}
