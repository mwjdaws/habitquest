
import { useCallback, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";

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
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const refreshInProgressRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  const refreshDebounceTimerRef = useRef<number | null>(null);
  
  // Constants for throttling and debouncing
  const REFRESH_THROTTLE = 800; // Min time between refreshes (ms)
  const DEBOUNCE_DELAY = 50; // Short debounce to combine rapid requests

  /**
   * Refreshes habit data with intelligent handling of concurrent requests,
   * debouncing, throttling, and error management
   */
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
            setTimeout(() => refreshData(false), DEBOUNCE_DELAY);
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
        
        // Update state with the new data
        updateState(result);
        
        setLastRefreshTime(now);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
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
          setTimeout(() => refreshData(false), DEBOUNCE_DELAY);
        }
      }
    }, DEBOUNCE_DELAY);
    
  }, [loadData, onSuccess, refreshAttempts, setError, setLoading, lastRefreshTime, updateState]);

  return {
    refreshData,
    lastRefreshTime,
    refreshAttempts,
    clearRefreshTimer: () => {
      if (refreshDebounceTimerRef.current) {
        window.clearTimeout(refreshDebounceTimerRef.current);
      }
    }
  };
}
