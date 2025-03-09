
import { useMemo, useCallback } from "react";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { HabitTrackingResult } from "./types";

/**
 * Primary hook for habit tracking functionality that combines data and actions
 */
export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { state, setState, refreshData } = useHabitData(onHabitChange);
  
  const { 
    handleToggleCompletion, 
    handleLogFailure,
    handleUndoFailure
  } = useHabitActions(state, setState, refreshData);

  // Calculate UI metrics once per render with proper dependencies
  const metrics = useMemo(() => {
    const totalCount = state.filteredHabits.length;
    const completedCount = state.filteredHabits.filter(habit => 
      state.completions.some(c => c.habit_id === habit.id)
    ).length;
    
    const progress = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;
    
    return { totalCount, completedCount, progress };
  }, [state.filteredHabits, state.completions]);

  // Wrap refreshData with useCallback to stabilize reference
  const stableRefreshData = useCallback((showLoading = true) => {
    refreshData(showLoading);
  }, [refreshData]);

  // Return a more efficiently memoized object with flattened metrics
  return useMemo(() => ({
    habits: state.filteredHabits,
    completions: state.completions,
    failures: state.failures,
    loading: state.loading,
    error: state.error,
    progress: metrics.progress,
    completedCount: metrics.completedCount,
    totalCount: metrics.totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData: stableRefreshData,
    isInitialized: state.isInitialized
  }), [
    state.filteredHabits,
    state.completions,
    state.failures,
    state.loading,
    state.error,
    state.isInitialized,
    metrics,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    stableRefreshData
  ]);
}
