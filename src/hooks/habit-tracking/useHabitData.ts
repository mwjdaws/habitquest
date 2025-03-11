
import { useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useHabitFetcher } from "./data/useHabitFetcher";
import { useHabitStateManager } from "./data/useHabitStateManager";
import { useDataRefresh } from "./data/useDataRefresh";
import { useVisibilityRefresh } from "./data/useVisibilityRefresh";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const { loadData, cancelPendingRequests, getCurrentVersion, clearCache } = useHabitFetcher();
  const { state, setState, updateHabits, setLoading, setError } = useHabitStateManager();
  const initialLoadAttemptedRef = useRef(false);
  
  // Update state with fetched data
  const updateState = useCallback((data) => {
    if (!data) return;
    
    // Batch state updates to reduce renders
    updateHabits(data.habits || []);
    
    setState(prev => ({
      ...prev,
      completions: data.completions || [],
      failures: data.failures || [],
      loading: false,
      error: null,
      isInitialized: true
    }));
    
    // Optional callback when habits change
    if (onHabitChange) {
      onHabitChange();
    }
  }, [setState, updateHabits, onHabitChange]);
  
  // Handle refresh using the dedicated refresh hook with debouncing
  const { refreshData, lastRefreshTime, refreshAttempts, clearRefreshTimer } = useDataRefresh(
    loadData,
    updateState,
    setLoading,
    setError,
    onHabitChange
  );
  
  // Handle visibility-based refreshes - only refresh if data is stale
  const { isInitializedRef } = useVisibilityRefresh(refreshData, lastRefreshTime);

  // Initial data load on component mount - only once
  useEffect(() => {
    // Check if already loaded or is loading
    if (!initialLoadAttemptedRef.current && !state.isInitialized && !state.loading && user) {
      console.log("[useHabitData] Initial mount, triggering data refresh");
      initialLoadAttemptedRef.current = true;
      refreshData(true, true); // Force refresh on initial load
    } else if (!user && !initialLoadAttemptedRef.current) {
      // If no user, mark as initialized to avoid loading state
      initialLoadAttemptedRef.current = true;
      setState(prev => ({
        ...prev,
        loading: false,
        isInitialized: true
      }));
    }
  }, [refreshData, isInitializedRef, state.isInitialized, state.loading, user, setState]);

  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      clearRefreshTimer();
      cancelPendingRequests();
    };
  }, [cancelPendingRequests, clearRefreshTimer]);

  return {
    state,
    setState,
    lastRefreshTime,
    refreshAttempts,
    loadData: refreshData,
    refreshData
  };
}
