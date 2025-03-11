
import { useCallback, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRequestManager } from "../utils/useRequestManager";
import { useAuth } from "@/contexts/AuthContext";
import { useHabitCache } from "./fetching/useHabitCache";
import { useHabitFetch } from "./fetching/useHabitFetch"; 
import { useRequestThrottling } from "./fetching/useRequestThrottling";
import { useDataVersion } from "./fetching/useDataVersion";
import { getTodayFormatted } from "@/lib/habitUtils";

/**
 * Hook to handle habit data fetching with improved error handling, cancellation, and caching
 */
export function useHabitFetcher() {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  
  // Use specialized hooks
  const { 
    createAbortController, 
    trackPromise, 
    cancelPendingRequests 
  } = useRequestManager();
  
  const {
    isValidCache,
    getCachedData,
    updateCache,
    clearCache
  } = useHabitCache();
  
  const { fetchHabitData } = useHabitFetch();
  
  const {
    shouldThrottle,
    markFetchStarted,
    markFetchCompleted
  } = useRequestThrottling();
  
  const {
    getCurrentVersion,
    getNextVersion
  } = useDataVersion();
  
  // Mark as initialized
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      console.log("useHabitFetcher initialized");
    }
  }, [initialized]);

  // Function to setup abort controller and handle fetch request with cache control
  const loadData = useCallback(async (showLoading = true, forceRefresh = false, selectedDate?: string) => {
    // Skip if not authenticated
    if (!user) {
      console.log("Skipping loadData - user not authenticated");
      return { habits: [], completions: [], failures: [], version: 0 };
    }
    
    // Use the selected date or default to today
    const date = selectedDate || getTodayFormatted();
    
    try {
      // Cancel any in-flight requests
      cancelPendingRequests();
      
      // Check throttling
      if (!forceRefresh && shouldThrottle()) {
        return null;
      }
      
      // Start fetch
      markFetchStarted();
      
      // Setup new controller
      const controller = createAbortController();
      const signal = controller.signal;
      
      // Invalidate cache if force refresh requested or not today's date
      if (forceRefresh || date !== getTodayFormatted()) {
        console.log(`Forcing data refresh for date ${date} (cache invalidated)`);
        clearCache();
      }
      
      // Check cache first if not forcing refresh and it's today's date
      if (!forceRefresh && date === getTodayFormatted()) {
        const cachedData = getCachedData();
        if (cachedData && !signal.aborted) {
          return cachedData;
        }
      }
      
      // Get next version
      const currentVersion = getNextVersion();
      console.log(`Starting data fetch for date ${date} (version ${currentVersion})`);
      
      // Perform fetch with the selected date
      const fetchResult = await fetchHabitData(signal, date);
      
      // Track promise for proper cancellation
      trackPromise(Promise.resolve(fetchResult));
      
      if (!fetchResult) {
        console.log("Fetch returned null result (likely throttled)");
        markFetchCompleted();
        return null;
      }
      
      if (signal?.aborted) {
        console.log('Fetch aborted after completion');
        markFetchCompleted();
        return null;
      }
      
      // Add version to result
      const result = {
        ...fetchResult,
        version: currentVersion
      };
      
      // Cache result if no error and it's today's date
      if (!result.error && date === getTodayFormatted()) {
        updateCache(result);
      } else if (showLoading && result.error) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please try again.",
          variant: "destructive",
        });
      }
      
      // Added debugging for result
      console.log(`Fetch completed for date ${date} with ${result.habits?.length || 0} habits`);
      
      markFetchCompleted();
      return result;
      
    } catch (error) {
      console.error("Unexpected error in loadData:", error);
      markFetchCompleted();
      return { 
        error: "An unexpected error occurred while loading data", 
        habits: [], 
        completions: [], 
        failures: [], 
        version: 0 
      };
    }
  }, [
    user, 
    fetchHabitData, 
    createAbortController, 
    cancelPendingRequests, 
    shouldThrottle,
    markFetchStarted,
    markFetchCompleted,
    getCachedData,
    updateCache,
    clearCache,
    getNextVersion,
    trackPromise
  ]);
  
  return {
    loadData,
    cancelPendingRequests,
    getCurrentVersion,
    clearCache
  };
}
