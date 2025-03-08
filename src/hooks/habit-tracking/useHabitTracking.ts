
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
    debouncedLoadData,
    dataLoadTimerRef,
    isMountedRef,
    initialLoadCompletedRef,
    lastFetchTimeRef
  } = useHabitData(onHabitChange);
  
  const [isInitialLoadSetUp, setIsInitialLoadSetUp] = useState(false);

  // Public method to refresh data with improved throttling
  const refreshData = useCallback((showLoading = false) => {
    // Add timestamp-based throttling to prevent excessive refreshes
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 800) {
      console.log('Throttling refresh - too many calls in short period');
      return;
    }
    lastFetchTimeRef.current = now;
    
    debouncedLoadData(showLoading);
  }, [debouncedLoadData, lastFetchTimeRef]);
  
  // Pass the state and setState directly to useHabitActions
  const { handleToggleCompletion, handleLogFailure } = useHabitActions(
    state,
    setState => setState,
    refreshData
  );

  // Optimize initial data loading with better cleanup
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
    
    // Set up sensible interval for periodic refreshes with a longer interval
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
  }, [user, loadData, dataLoadTimerRef, isInitialLoadSetUp, initialLoadCompletedRef]);
  
  // Memoize calculated values to prevent unnecessary recalculations
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
