
import { useMemo, useCallback } from "react";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { useHabitMetrics } from "./utils/useHabitMetrics";
import { HabitTrackingResult } from "./types";

/**
 * Primary hook for habit tracking functionality that provides a complete solution
 * for tracking, displaying, and interacting with habits
 * 
 * This hook combines data fetching, action handling, and metrics calculation into a
 * single, easy-to-use interface for habit tracking components.
 *
 * @param {function} [onHabitChange] - Optional callback that runs when habits are modified
 * @returns {HabitTrackingResult} Complete set of habit tracking data and functions
 */
export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { state, setState, refreshData } = useHabitData(onHabitChange);
  
  // Get actions from separate hook
  const { 
    handleToggleCompletion, 
    handleLogFailure,
    handleUndoFailure
  } = useHabitActions(state, setState, refreshData);

  // Calculate UI metrics using a dedicated hook
  const metrics = useHabitMetrics(state.filteredHabits, state.completions);

  // Wrap refreshData with useCallback to stabilize reference
  const stableRefreshData = useCallback((showLoading = true) => {
    console.log('Refreshing habit data from useHabitTracking');
    refreshData(showLoading, true); // Force refresh to ensure data is loaded
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
