
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRefreshThrottling } from "./refresh/useRefreshThrottling";
import { useRefreshQueue } from "./refresh/useRefreshQueue";
import { useRefreshDebounce } from "./refresh/useRefreshDebounce";

/**
 * Hook to manage habit data refreshing with throttling and debouncing
 */
export function useDataRefresh(
  loadData: (showLoading: boolean, forceRefresh: boolean) => Promise<any>,
  updateState: (data: any) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  onSuccess?: () => void
) {
  // Use specialized hooks for different concerns
  const { 
    lastRefreshTime, 
    refreshAttempts, 
    shouldThrottleRefresh, 
    markRefreshComplete,
    getTimeUntilAvailable,
    clearThrottleTimer
  } = useRefreshThrottling();
  
  const {
    isRefreshInProgress,
    hasQueuedRefresh,
    markRefreshStarted,
    markRefreshCompleted,
    queueRefresh,
    clearQueuedRefresh
  } = useRefreshQueue();
  
  const {
    clearDebounceTimer,
    setDebounceTimer
  } = useRefreshDebounce();

  /**
   * Refreshes habit data with intelligent handling of concurrent requests,
   * debouncing, throttling, and error management
   */
  const refreshData = useCallback(async (showLoading = true, forceRefresh = false) => {
    console.log(`[useDataRefresh] Refreshing data (show loading: ${showLoading}, force refresh: ${forceRefresh})`);
    
    // Always clear any pending debounce timer and throttle timer
    clearDebounceTimer();
    clearThrottleTimer();
    
    // If force refresh, always proceed regardless of in-progress state
    if (forceRefresh) {
      markRefreshCompleted();
    }
    
    // Check if refresh is already in progress
    if (isRefreshInProgress()) {
      console.log("[useDataRefresh] Refresh already in progress, queueing request");
      queueRefresh();
      return;
    }
    
    // Check throttling unless forced
    if (!forceRefresh && shouldThrottleRefresh(forceRefresh)) {
      console.log(`[useDataRefresh] Throttling refresh (${getTimeUntilAvailable()}ms until next available)`);
      
      if (hasQueuedRefresh()) {
        clearQueuedRefresh();
        const delay = getTimeUntilAvailable();
        setTimeout(() => refreshData(false), delay);
      }
      return;
    }
    
    // Set debounce timer with the main refresh logic
    setDebounceTimer(async () => {
      try {
        // Mark refresh as started
        markRefreshStarted();
        
        if (showLoading) {
          console.log("[useDataRefresh] Setting loading state to true");
          setLoading(true);
        }
        
        console.log(`[useDataRefresh] Starting data refresh #${refreshAttempts + 1}${forceRefresh ? ' (forced)' : ''}`);
        
        const result = await loadData(showLoading, forceRefresh);
        
        if (!result) {
          console.log("[useDataRefresh] No data returned from loadData");
          if (showLoading) {
            setLoading(false);
          }
          markRefreshCompleted();
          
          // Process queued refresh if needed
          if (hasQueuedRefresh()) {
            clearQueuedRefresh();
            setTimeout(() => refreshData(false), 50);
          }
          return;
        }
        
        if (result.error) {
          console.error("[useDataRefresh] Error loading habit data:", result.error);
          setError(result.error);
          
          // Only show toast for user-initiated refreshes
          if (showLoading) {
            toast({
              title: "Error loading habits",
              description: "Please try again later",
              variant: "destructive"
            });
          }
          if (showLoading) {
            setLoading(false);
          }
          markRefreshCompleted();
          return;
        }
        
        // Update state with the new data
        console.log("[useDataRefresh] Data fetched successfully, updating state");
        updateState(result);
        
        markRefreshComplete();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        console.log(`[useDataRefresh] Data fetch complete (v${result.version}): ${result.habits?.length || 0} habits, ${result.completions?.length || 0} completions, ${result.failures?.length || 0} failures`);
      } catch (error) {
        console.error("[useDataRefresh] Unexpected error refreshing data:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
        
        if (showLoading) {
          toast({
            title: "Error",
            description: "An unexpected error occurred while loading your habits",
            variant: "destructive"
          });
        }
      } finally {
        if (showLoading) {
          console.log("[useDataRefresh] Setting loading state to false");
          setLoading(false);
        }
        markRefreshCompleted();
        
        // Process queued refresh requests
        if (hasQueuedRefresh()) {
          clearQueuedRefresh();
          console.log("[useDataRefresh] Processing queued refresh request");
          setTimeout(() => refreshData(false), 50);
        }
      }
    }, forceRefresh);
    
  }, [
    clearDebounceTimer,
    setDebounceTimer,
    loadData,
    updateState,
    setLoading,
    setError,
    onSuccess,
    refreshAttempts,
    isRefreshInProgress,
    hasQueuedRefresh,
    markRefreshStarted,
    markRefreshCompleted,
    queueRefresh,
    clearQueuedRefresh,
    shouldThrottleRefresh,
    getTimeUntilAvailable,
    markRefreshComplete,
    clearThrottleTimer
  ]);

  return {
    refreshData,
    lastRefreshTime,
    refreshAttempts,
    clearRefreshTimer: useCallback(() => {
      clearDebounceTimer();
      clearThrottleTimer();
    }, [clearDebounceTimer, clearThrottleTimer])
  };
}
