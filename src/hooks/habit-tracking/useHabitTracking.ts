import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { HabitTrackingResult } from "./types";

export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { user } = useAuth();
  const { 
    state,
    loadData,
    debouncedLoadData,
    dataLoadTimerRef,
    isMountedRef,
    initialLoadCompletedRef,
    lastFetchTimeRef
  } = useHabitData(onHabitChange);
  
  const [isInitialLoadSetUp, setIsInitialLoadSetUp] = useState(false);

  // Public method to refresh data
  const refreshData = useCallback((showLoading = false) => {
    debouncedLoadData(showLoading);
  }, [debouncedLoadData]);
  
  const { handleToggleCompletion, handleLogFailure } = useHabitActions(
    state,
    setState => {
      // This adapter pattern allows us to keep the same API while using the new structure
      // useState setter function doesn't exist in the new structure, so we update the object directly
      state.habits = setState(state).habits;
      state.filteredHabits = setState(state).filteredHabits;
      state.completions = setState(state).completions;
      state.failures = setState(state).failures;
      state.loading = setState(state).loading;
      state.error = setState(state).error;
      state.isInitialized = setState(state).isInitialized;
    },
    refreshData
  );

  // Only load data when component mounts and user is authenticated
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isInitialLoadSetUp && user) {
      setIsInitialLoadSetUp(true);
      
      // Small delay before initial load to ensure everything is ready
      dataLoadTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current) {
          loadData(true);
        }
      }, 500);
    }
    
    // Set up sensible interval for periodic refreshes (every 5 minutes)
    const refreshInterval = window.setInterval(() => {
      if (user && initialLoadCompletedRef.current && isMountedRef.current) {
        loadData(false); // Silent refresh
      }
    }, 300000); // 5 minutes
    
    return () => {
      isMountedRef.current = false;
      
      if (dataLoadTimerRef.current) {
        window.clearTimeout(dataLoadTimerRef.current);
      }
      
      window.clearInterval(refreshInterval);
    };
  }, [user, loadData, dataLoadTimerRef, isInitialLoadSetUp]);
  
  // Calculate progress
  const completedCount = state.filteredHabits.length > 0 
    ? state.filteredHabits.filter(habit => state.completions.some(c => c.habit_id === habit.id)).length 
    : 0;
    
  const progress = state.filteredHabits.length > 0 
    ? Math.round((completedCount / state.filteredHabits.length) * 100) 
    : 0;

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
