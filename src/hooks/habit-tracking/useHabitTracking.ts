
import { useMemo, useCallback, useEffect, useRef } from "react";
import { useHabitData } from "./useHabitData";
import { useHabitActions } from "./useHabitActions";
import { useHabitMetrics } from "./utils/useHabitMetrics";
import { HabitTrackingResult } from "./types";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, isLoading: authLoading } = useAuth();
  const { state, setState, refreshData } = useHabitData(onHabitChange);
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
  const stableRefreshData = useCallback((showLoading = true) => {
    console.log('Refreshing habit data from useHabitTracking');
    
    // Only refresh data if user is authenticated
    if (user) {
      refreshData(showLoading, true); // Force refresh to ensure data is loaded
    } else {
      console.log('Skipping habit data refresh - user not authenticated');
    }
  }, [refreshData, user]);
  
  // Effect to handle initial data loading after authentication is complete
  useEffect(() => {
    // Only attempt to load data once authentication check is complete
    if (!authLoading && user && !initialLoadAttemptedRef.current) {
      console.log('Authentication complete, user authenticated. Loading initial habit data.');
      initialLoadAttemptedRef.current = true;
      stableRefreshData(true);
    } else if (!authLoading && !user && !initialLoadAttemptedRef.current) {
      console.log('Authentication complete, but user is not authenticated. Skipping data load.');
      initialLoadAttemptedRef.current = true;
      // Set initialized to true even without data to avoid loading state for unauthenticated users
      setState(prev => ({
        ...prev,
        loading: false,
        isInitialized: true
      }));
    }
  }, [authLoading, user, stableRefreshData, setState]);

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
