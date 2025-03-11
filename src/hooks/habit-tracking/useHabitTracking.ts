
import { useMemo, useCallback, useEffect, useRef } from "react";
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
  const { state, setState, refreshData, clearCache } = useHabitData(onHabitChange);
  const initialLoadAttemptedRef = useRef(false);
  
  // Get actions from separate hook
  const { 
    handleToggleCompletion, 
    handleLogFailure,
    handleUndoFailure
  } = useHabitActions(state, setState, refreshData);

  // Calculate UI metrics using a dedicated hook
  const metrics = useHabitMetrics(state.filteredHabits || [], state.completions || []);

  // Wrap refreshData with useCallback to stabilize reference
  const stableRefreshData = useCallback((showLoading = true, forceRefresh = true) => {
    console.log('[useHabitTracking] Refreshing habit data', { isAuthenticated: !!user });
    
    // Only refresh data if user is authenticated
    if (user) {
      refreshData(showLoading, forceRefresh);
      
      // Force clear cache and retry if force refresh is requested
      if (forceRefresh) {
        clearCache();
      }
    } else {
      console.log('[useHabitTracking] Skipping habit data refresh - user not authenticated');
    }
  }, [refreshData, user, clearCache]);
  
  // Effect to handle initial data loading after authentication is complete
  useEffect(() => {
    // Only attempt to load data once authentication check is complete
    if (!authLoading && !initialLoadAttemptedRef.current) {
      initialLoadAttemptedRef.current = true;
      
      if (user) {
        console.log('[useHabitTracking] Authentication complete, user authenticated. Loading initial habit data.');
        stableRefreshData(true, true);
      } else {
        console.log('[useHabitTracking] Authentication complete, but user is not authenticated. Skipping data load.');
        // Set initialized to true even without data to avoid loading state for unauthenticated users
        setState(prev => ({
          ...prev,
          loading: false,
          isInitialized: true
        }));
      }
    }
  }, [authLoading, user, stableRefreshData, setState]);

  // Retry data loading if auth state changes to logged in after component mount
  useEffect(() => {
    if (user && initialLoadAttemptedRef.current && !state.habits?.length && !state.loading) {
      console.log('[useHabitTracking] User authenticated after initial load, retrying data fetch');
      stableRefreshData(true, true);
    }
  }, [user, state.habits, state.loading, stableRefreshData]);

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
    refreshData: stableRefreshData,
    isInitialized: state.isInitialized,
    isAuthenticated: !!user
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
    stableRefreshData,
    authLoading,
    user
  ]);
}
