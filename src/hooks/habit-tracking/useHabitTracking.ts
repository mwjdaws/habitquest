
import { useEffect, useMemo, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { HabitTrackingResult } from "./types";

export function useHabitTracking(onHabitChange?: () => void): HabitTrackingResult {
  const { user } = useAuth();
  const refreshTimerRef = useRef<number | null>(null);
  
  const { 
    state,
    loadData,
    refreshData,
    setState
  } = useHabitData(onHabitChange);
  
  // Get actions with optimized state updates and pass setState directly
  const { handleToggleCompletion, handleLogFailure } = useHabitActions(
    state,
    setState, // Pass setState directly to avoid indirect state updates
    refreshData
  );

  // Debounced refresh handler to prevent multiple rapid refreshes
  const handleRefresh = useCallback((showLoading = true) => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }
    
    refreshTimerRef.current = window.setTimeout(() => {
      refreshData(showLoading);
      refreshTimerRef.current = null;
    }, 50); // Small delay to debounce multiple calls
  }, [refreshData]);

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData(true);
      
      // Reduced frequency of background refreshes (15 minutes)
      const refreshInterval = window.setInterval(() => {
        if (user && document.visibilityState === 'visible') {
          refreshData(false); // Silent refresh
        }
      }, 900000); // 15 minutes
      
      return () => {
        window.clearInterval(refreshInterval);
        // Clear any pending refresh timers
        if (refreshTimerRef.current) {
          window.clearTimeout(refreshTimerRef.current);
        }
      };
    }
  }, [user, loadData, refreshData]);
  
  // More stable memoization with careful dependency tracking
  const stats = useMemo(() => {
    const { filteredHabits, completions } = state;
    if (!filteredHabits.length) return { progress: 0, completedCount: 0 };
    
    const completed = filteredHabits.filter(
      habit => completions.some(c => c.habit_id === habit.id)
    ).length;
    
    const progress = Math.round((completed / filteredHabits.length) * 100);
    
    return { progress, completedCount: completed };
  }, [state.filteredHabits, state.completions]);

  return {
    habits: state.filteredHabits,
    completions: state.completions,
    failures: state.failures,
    loading: state.loading,
    error: state.error,
    progress: stats.progress,
    completedCount: stats.completedCount,
    totalCount: state.filteredHabits.length,
    handleToggleCompletion,
    handleLogFailure,
    refreshData: handleRefresh,
    isInitialized: state.isInitialized,
  };
}
