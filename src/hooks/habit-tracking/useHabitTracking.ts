
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { HabitTrackingResult } from "./types";

export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { user } = useAuth();
  const { 
    state,
    loadData,
    refreshData
  } = useHabitData(onHabitChange);
  
  // Pass the state and setState directly to useHabitActions
  const { handleToggleCompletion, handleLogFailure } = useHabitActions(
    state,
    setState => setState,
    refreshData
  );

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData(true);
      
      // Set up periodic refresh
      const refreshInterval = window.setInterval(() => {
        if (user && document.visibilityState === 'visible') {
          refreshData(false); // Silent refresh
        }
      }, 300000); // 5 minutes
      
      return () => {
        window.clearInterval(refreshInterval);
      };
    }
  }, [user, loadData, refreshData]);
  
  // Memoize calculated values
  const { progress, completedCount } = useMemo(() => {
    const completed = state.filteredHabits.length > 0 
      ? state.filteredHabits.filter(habit => state.completions.some(c => c.habit_id === habit.id)).length 
      : 0;
      
    const prog = state.filteredHabits.length > 0 
      ? Math.round((completed / state.filteredHabits.length) * 100) 
      : 0;
    
    return { progress: prog, completedCount: completed };
  }, [state.filteredHabits, state.completions]);

  return {
    habits: state.filteredHabits,
    completions: state.completions,
    failures: state.failures,
    loading: state.loading,
    error: state.error,
    progress,
    completedCount,
    totalCount: state.filteredHabits.length,
    handleToggleCompletion,
    handleLogFailure,
    refreshData,
    isInitialized: state.isInitialized,
  };
}
