
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { HabitTrackingState } from "./types";
import { useHabitFetcher } from "./data/useHabitFetcher";
import { useHabitStateManager } from "./data/useHabitStateManager";
import { useVisibilityManager } from "./utils/useVisibilityManager";

export function useHabitData(onHabitChange?: () => void) {
  const { loadData, cancelPendingRequests, getCurrentVersion, clearCache } = useHabitFetcher();
  const { state, setState, updateHabits, setLoading, setError } = useHabitStateManager();
  const isInitializedRef = useRef(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const refreshInProgressRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  const refreshDebounceTimerRef = useRef<number | null>(null);

  // Improved refresh function with better error handling, debouncing and queueing
  const refreshData = useCallback(async (showLoading = true, forceRefresh = false) => {
    // Debounce rapid refresh requests (within 300ms)
    if (refreshDebounceTimerRef.current) {
      window.clearTimeout(refreshDebounceTimerRef.current);
      refreshDebounceTimerRef.current = null;
    }
    
    // Use a ref to track in-progress state to avoid state update race conditions
    if (refreshInProgressRef.current) {
      console.log("Refresh already in progress, queueing request");
      refreshQueuedRef.current = true;
      return;
    }
    
    // Short debounce delay to prevent duplicate calls
    refreshDebounceTimerRef.current = window.setTimeout(async () => {
      refreshInProgressRef.current = true;
      
      if (showLoading) {
        setLoading(true);
      }
      
      try {
        setRefreshAttempts(prev => prev + 1);
        const result = await loadData(showLoading, forceRefresh);
        
        if (!result) {
          console.log("Request was throttled, aborted, or using cached data");
          refreshInProgressRef.current = false;
          
          // Process queued refresh if needed
          if (refreshQueuedRef.current) {
            refreshQueuedRef.current = false;
            // Small delay to prevent potential recursion issues
            setTimeout(() => refreshData(false), 50);
          }
          return;
        }
        
        if (result.error) {
          setError(result.error);
          console.error("Error loading habit data:", result.error);
          
          // Only show toast for user-initiated refreshes (showLoading = true)
          if (showLoading) {
            toast({
              title: "Error loading habits",
              description: "Please try again later",
              variant: "destructive"
            });
          }
          refreshInProgressRef.current = false;
          return;
        }
        
        // Update state with new data
        updateHabits(result.habits);
        
        setState(prev => ({
          ...prev,
          completions: result.completions,
          failures: result.failures,
          loading: false,
          error: null,
          isInitialized: true
        }));
        
        setLastRefreshTime(new Date());
        
        // Notify parent if needed
        if (onHabitChange) {
          onHabitChange();
        }
        
        console.log(`Data fetch complete (version ${result.version}):`, {
          habits: result.habits.length,
          filtered: state.filteredHabits.length,
          completions: result.completions.length,
          failures: result.failures.length
        });
      } catch (error) {
        console.error("Unexpected error refreshing data:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
        setLoading(false);
        
        if (showLoading) {
          toast({
            title: "Error",
            description: "An unexpected error occurred while loading your habits",
            variant: "destructive"
          });
        }
      } finally {
        refreshInProgressRef.current = false;
        
        // Process queued refresh requests
        if (refreshQueuedRef.current) {
          refreshQueuedRef.current = false;
          console.log("Processing queued refresh request");
          // Small delay to prevent potential recursion issues
          setTimeout(() => refreshData(false), 50);
        }
      }
    }, 50); // Short 50ms debounce
    
  }, [loadData, onHabitChange, setError, setLoading, setState, state.filteredHabits.length, updateHabits]);

  // Handle visibility changes by refreshing data when tab becomes visible again
  useVisibilityManager(() => {
    if (isInitializedRef.current && !refreshInProgressRef.current) {
      // When tab becomes visible again, check if data is stale (>60s)
      const now = new Date();
      const staleThreshold = 60000; // 60 seconds
      
      if (!lastRefreshTime || now.getTime() - lastRefreshTime.getTime() > staleThreshold) {
        console.log("Tab visible, refreshing stale data");
        refreshData(false, true); // Force refresh when coming back after a long time
      } else {
        console.log("Tab visible, but data is fresh - no refresh needed");
      }
    }
  });

  // Initial data load on component mount - only once with better tracking
  useEffect(() => {
    if (!isInitializedRef.current) {
      const timeout = setTimeout(() => {
        console.log("[useHabitData] Initial mount, triggering data refresh");
        refreshData(true, true); // Force refresh on initial load
        isInitializedRef.current = true;
      }, 50); // Small delay to avoid concurrent rendering issues
      
      return () => clearTimeout(timeout);
    }
  }, [refreshData]);

  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      // Clear any pending debounce timers
      if (refreshDebounceTimerRef.current) {
        window.clearTimeout(refreshDebounceTimerRef.current);
      }
      
      cancelPendingRequests();
      // Clear cache on unmount to ensure fresh data on next mount
      clearCache();
    };
  }, [cancelPendingRequests, clearCache]);

  return {
    state,
    setState,
    lastRefreshTime,
    refreshAttempts,
    loadData: refreshData,
    refreshData
  };
}
