
import { useMemo } from "react";
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

  // Calculate UI metrics once per render
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
  
  return {
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
  };
}
