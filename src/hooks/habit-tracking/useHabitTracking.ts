
import { useMemo, useCallback } from "react";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { useHabitMetrics } from "./utils/useHabitMetrics";
import { HabitTrackingResult } from "./types";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Primary hook for habit tracking functionality that provides a complete solution
 * for tracking, displaying, and interacting with habits
 */
export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { user, isLoading: authLoading } = useAuth();
  
  // Get actions from separate hook
  const { 
    handleToggleCompletion, 
    handleLogFailure,
    handleUndoFailure,
    selectedDate,
    setSelectedDate,
    isToday
  } = useHabitActions(state, state.setState, refreshData);
  
  // Get data with the selected date
  const { 
    state, 
    refreshData, 
    clearCache,
    isInitialized
  } = useHabitData(onHabitChange, selectedDate);

  // Calculate UI metrics using a dedicated hook
  const metrics = useHabitMetrics(state.filteredHabits || [], state.completions || [], selectedDate);

  // Return a more efficiently memoized object with flattened metrics
  return useMemo(() => ({
    habits: state.filteredHabits || [],
    completions: state.completions || [],
    failures: state.failures || [],
    loading: state.loading || authLoading,
    error: state.error,
    progress: metrics.progress,
    completedCount: metrics.completedCount,
    totalCount: metrics.totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData,
    isInitialized: state.isInitialized,
    isAuthenticated: !!user,
    selectedDate,
    setSelectedDate,
    isToday
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
    refreshData,
    authLoading,
    user,
    selectedDate,
    setSelectedDate,
    isToday
  ]);
}
