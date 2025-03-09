
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
  
  // Minimum time between refreshes (ms)
  const REFRESH_THROTTLE = 800;
  // Time after which data is considered stale when tab becomes visible again (ms)
  const STALE_THRESHOLD = 60000; // 60 seconds

  // Improved refresh function with better error handling, debouncing and queueing
  const refreshData = useCallback(async (showLoading = true, forceRefresh = false) => {
    // Check if refresh is already in progress
    if (refreshInProgressRef.current) {
      console.log("Refresh already in progress, queueing request");
      refreshQueuedRef.current = true;
      return;
    }
    
    // Debounce rapid refresh requests
    if (refreshDebounceTimerRef.current) {
      window.clearTimeout(refreshDebounceTimerRef.current);
      refreshDebounceTimerRef.current = null;
    }
    
    // Short debounce delay to prevent duplicate calls
    refreshDebounceTimerRef.current = window.setTimeout(async () => {
      const now = new Date();
      const elapsed = lastRefreshTime ? now.getTime() - lastRefreshTime.getTime() : REFRESH_THROTTLE + 1;
      
      // Throttle refreshes that happen too quickly unless forced
      if (!forceRefresh && elapsed < REFRESH_THROTTLE) {
        console.log(`Throttling refresh (${elapsed}ms since last refresh)`);
        refreshInProgressRef.current = false;
        
        if (refreshQueuedRef.current) {
          refreshQueuedRef.current = false;
          setTimeout(() => refreshData(false), REFRESH_THROTTLE - elapsed);
        }
        return;
      }
      
      refreshInProgressRef.current = true;
      
      if (showLoading) {
        setLoading(true);
      }
      
      try {
        setRefreshAttempts(prev => prev + 1);
        console.log(`Starting data refresh #${refreshAttempts + 1}${forceRefresh ? ' (forced)' : ''}`);
        
        const result = await loadData(showLoading, forceRefresh);
        
        if (!result) {
          console.log("Request was throttled, aborted, or using cached data");
          refreshInProgressRef.current = false;
          
          // Process queued refresh if needed
          if (refreshQueuedRef.current) {
            refreshQueuedRef.current = false;
            setTimeout(() => refreshData(false), 50);
          }
          return;
        }
        
        if (result.error) {
          setError(result.error);
          console.error("Error loading habit data:", result.error);
          
          // Only show toast for user-initiated refreshes
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
        
        // Batch state updates to reduce renders
        updateHabits(result.habits);
        
        setState(prev => ({
          ...prev,
          completions: result.completions,
          failures: result.failures,
          loading: false,
          error: null,
          isInitialized: true
        }));
        
        setLastRefreshTime(now);
        
        // Notify parent if needed
        if (onHabitChange) {
          onHabitChange();
        }
        
        console.log(`Data fetch complete (v${result.version}): ${result.habits.length} habits, ${result.completions.length} completions, ${result.failures.length} failures`);
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
          setTimeout(() => refreshData(false), 50);
        }
      }
    }, 50); // Short 50ms debounce
    
  }, [loadData, onHabitChange, refreshAttempts, setError, setLoading, setState, lastRefreshTime, updateHabits]);

  // Handle visibility changes - only refresh if data is stale
  useVisibilityManager(() => {
    if (isInitializedRef.current && !refreshInProgressRef.current) {
      const now = new Date();
      
      if (!lastRefreshTime || now.getTime() - lastRefreshTime.getTime() > STALE_THRESHOLD) {
        console.log("Tab visible, refreshing stale data");
        refreshData(false, true); // Force refresh when coming back after a long time
      } else {
        console.log("Tab visible, but data is fresh - no refresh needed");
      }
    }
  });

  // Initial data load on component mount - only once
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
