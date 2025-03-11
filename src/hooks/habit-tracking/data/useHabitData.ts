
import { useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useHabitFetcher } from "./useHabitFetcher";
import { useHabitStateManager } from "./useHabitStateManager";
import { useDataRefresh } from "./useDataRefresh";
import { useVisibilityRefresh } from "./useVisibilityRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { formatTorontoDate } from "@/lib/dateUtils";

/**
 * Core hook that manages habit data fetching, caching, refreshing, and state management
 */
export function useHabitData(onHabitChange?: () => void, selectedDate?: string) {
  const { user } = useAuth();
  const { loadData, cancelPendingRequests, getCurrentVersion, clearCache } = useHabitFetcher();
  const { state, setState, updateHabits, setLoading, setError } = useHabitStateManager();
  const initialLoadAttemptedRef = useRef(false);
  const userPresentForInitialLoadRef = useRef(false);
  const lastSelectedDateRef = useRef(selectedDate);
  
  // Update state with fetched data
  const updateState = useCallback((data) => {
    if (!data) {
      console.log("[useHabitData] No data to update state with");
      setLoading(false);  // Ensure loading is set to false
      return;
    }
    
    console.log("[useHabitData] Updating state with fetched data:", {
      habits: data.habits?.length || 0,
      completions: data.completions?.length || 0,
      failures: data.failures?.length || 0,
      selectedDate: selectedDate
    });
    
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
  }, [setState, updateHabits, onHabitChange, setLoading, selectedDate]);
  
  // Handle refresh using the dedicated refresh hook with debouncing
  const { refreshData, lastRefreshTime, refreshAttempts, clearRefreshTimer } = useDataRefresh(
    (showLoading = true, forceRefresh = false) => loadData(showLoading, forceRefresh, selectedDate),
    updateState,
    setLoading,
    setError,
    onHabitChange
  );
  
  // Handle visibility-based refreshes - only refresh if data is stale
  const { isInitializedRef } = useVisibilityRefresh(refreshData, lastRefreshTime);

  // Initial data load on component mount - only once
  useEffect(() => {
    // Check if user is available for initial load
    if (user && !userPresentForInitialLoadRef.current) {
      userPresentForInitialLoadRef.current = true;
    }
    
    // Check if already loaded or is loading
    if (!initialLoadAttemptedRef.current && !state.isInitialized && !state.loading) {
      console.log("[useHabitData] Initial mount, checking authentication status");
      
      if (user) {
        console.log("[useHabitData] User authenticated, triggering data refresh");
        initialLoadAttemptedRef.current = true;
        
        // Use a short delay to avoid race conditions during initialization
        const timer = setTimeout(() => {
          refreshData(true, true); // Force refresh on initial load with loading indicator
        }, 50);
        
        return () => clearTimeout(timer);
      } else if (!user && !initialLoadAttemptedRef.current) {
        // If no user, mark as initialized to avoid loading state for unauthenticated users
        console.log("[useHabitData] No authenticated user, skipping data load");
        initialLoadAttemptedRef.current = true;
        setState(prev => ({
          ...prev,
          loading: false,
          isInitialized: true
        }));
      }
    }
  }, [refreshData, isInitializedRef, state.isInitialized, state.loading, user, setState]);

  // Rehydrate data when user changes from null to an authenticated user
  useEffect(() => {
    if (user && initialLoadAttemptedRef.current && !userPresentForInitialLoadRef.current) {
      console.log("[useHabitData] User authenticated after initial load attempt, re-fetching data");
      userPresentForInitialLoadRef.current = true;
      refreshData(true, true);
    }
  }, [user, refreshData]);

  // Effect for date changes - trigger refresh when selected date changes
  useEffect(() => {
    if (user && state.isInitialized && selectedDate && selectedDate !== lastSelectedDateRef.current) {
      console.log(`[useHabitData] Date changed from ${lastSelectedDateRef.current} to ${selectedDate}, refreshing data`);
      lastSelectedDateRef.current = selectedDate;
      
      // Force refresh on date change to ensure we get the correct data
      clearCache();
      refreshData(true, true);
    }
  }, [selectedDate, user, state.isInitialized, refreshData, clearCache]);

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
    refreshData,
    clearCache,
    isInitialized: state.isInitialized
  };
}
