
import { useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useHabitFetcher } from "./data/useHabitFetcher";
import { useHabitStateManager } from "./data/useHabitStateManager";
import { useDataRefresh } from "./data/useDataRefresh";
import { useVisibilityRefresh } from "./data/useVisibilityRefresh";

/**
 * Core hook that manages habit data fetching, caching, refreshing, and state management
 * 
 * This hook handles the complete lifecycle of habit data:
 * - Initial loading on mount
 * - Refreshing data when requested or when tab becomes visible
 * - Managing cache and stale data
 * - Handling loading states and errors
 * - Debouncing and throttling requests to prevent API overload
 */
export function useHabitData(onHabitChange?: () => void) {
  const { loadData, cancelPendingRequests, getCurrentVersion, clearCache } = useHabitFetcher();
  const { state, setState, updateHabits, setLoading, setError } = useHabitStateManager();
  
  // Update state with fetched data
  const updateState = useCallback((data) => {
    // Batch state updates to reduce renders
    updateHabits(data.habits);
    
    setState(prev => ({
      ...prev,
      completions: data.completions,
      failures: data.failures,
      loading: false,
      error: null,
      isInitialized: true
    }));
  }, [setState, updateHabits]);
  
  // Handle refresh using the dedicated refresh hook
  const { refreshData, lastRefreshTime, refreshAttempts, clearRefreshTimer } = useDataRefresh(
    loadData,
    updateState,
    setLoading,
    setError,
    onHabitChange
  );
  
  // Handle visibility-based refreshes
  const { isInitializedRef } = useVisibilityRefresh(refreshData, lastRefreshTime);

  // Initial data load on component mount - only once
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitializedRef.current) {
        console.log("[useHabitData] Initial mount, triggering data refresh");
        refreshData(true, true); // Force refresh on initial load
      }
    }, 50); // Small delay to avoid concurrent rendering issues
    
    return () => clearTimeout(timeout);
  }, [refreshData, isInitializedRef]);

  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      clearRefreshTimer();
      cancelPendingRequests();
      clearCache();
    };
  }, [cancelPendingRequests, clearCache, clearRefreshTimer]);

  return {
    state,
    setState,
    lastRefreshTime,
    refreshAttempts,
    loadData: refreshData,
    refreshData
  };
}
