
import { useCallback, useRef, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  getTodayFormatted
} from "@/lib/habits";
import { withRetry, handleApiError } from "@/lib/error-utils";
import { useRequestManager } from "../utils/useRequestManager";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to handle habit data fetching with improved error handling, cancellation, and caching
 */
export function useHabitFetcher() {
  const { user } = useAuth();
  const { 
    createAbortController, 
    trackPromise, 
    cancelPendingRequests 
  } = useRequestManager();
  
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const dataVersionRef = useRef(0);
  const cacheExpiryRef = useRef(0);
  const cachedDataRef = useRef<any>(null);
  const today = getTodayFormatted();
  const [initialized, setInitialized] = useState(false);

  // Clear cache on user change
  useEffect(() => {
    cachedDataRef.current = null;
    cacheExpiryRef.current = 0;
    console.log("Cache cleared due to user change");
  }, [user]);
  
  // Mark as initialized
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      console.log("useHabitFetcher initialized");
    }
  }, [initialized]);

  // Enhanced data loading with improved error handling, request cancellation, and batch fetching
  const fetchHabitData = useCallback(async (signal?: AbortSignal) => {
    // Skip if not authenticated
    if (!user) {
      console.log("Skipping habit data fetch - user not authenticated");
      return { habits: [], completions: [], failures: [], version: 0 };
    }
    
    // Improved request throttling
    const now = Date.now();
    
    // Cache is valid for 30 seconds unless force refresh is requested
    const CACHE_TTL = 30000; // 30 seconds
    const THROTTLE_MS = 500; // 500ms minimum between requests
    
    // Check for valid cache first
    if (cachedDataRef.current && now < cacheExpiryRef.current && !signal?.aborted) {
      console.log("Using cached habit data, age:", Math.round((now - (cacheExpiryRef.current - CACHE_TTL))/1000), "seconds");
      return cachedDataRef.current;
    }
    
    // Enhanced throttling to prevent excessive requests
    if (now - lastFetchTimeRef.current < THROTTLE_MS) {
      console.log(`Throttling fetch request (${now - lastFetchTimeRef.current}ms since last fetch)`);
      return null;
    }
    
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.log("Fetch already in progress, waiting...");
      return null;
    }
    
    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
    
    // Increment data version to track current request
    const currentVersion = ++dataVersionRef.current;
    console.log(`Starting data fetch (version ${currentVersion})`);
    
    try {
      // Check for aborted signal first
      if (signal?.aborted) {
        console.log('Fetch aborted before starting');
        return null;
      }
      
      // Create fetch promises with retry and abort signal
      const habitsPromise = withRetry(() => fetchHabits(), 2, signal);
      const completionsPromise = withRetry(() => getCompletionsForDate(today), 2, signal);
      const failuresPromise = withRetry(() => getFailuresForDate(today), 2, signal);
      
      // Track all promises for proper cancellation
      trackPromise(habitsPromise);
      trackPromise(completionsPromise);
      trackPromise(failuresPromise);
      
      // Optimized data fetching with parallel requests
      const results = await Promise.allSettled([
        habitsPromise,
        completionsPromise,
        failuresPromise
      ]);
      
      // Check for abort after network requests complete
      if (signal?.aborted) {
        console.log('Fetch aborted mid-operation');
        return null;
      }
      
      // Extract results with proper error handling
      const habitsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const completionsData = results[1].status === 'fulfilled' ? results[1].value : [];
      const failuresData = results[2].status === 'fulfilled' ? results[2].value : [];
      
      // Log any individual failures
      if (results[0].status === 'rejected') {
        console.error("Failed to fetch habits:", results[0].reason);
      }
      if (results[1].status === 'rejected') {
        console.error("Failed to fetch completions:", results[1].reason);
      }
      if (results[2].status === 'rejected') {
        console.error("Failed to fetch failures:", results[2].reason);
      }
      
      console.log("Habits data fetched successfully:", habitsData?.length || 0, "habits");
      
      // Cache the result
      const result = {
        habits: habitsData || [],
        completions: completionsData || [],
        failures: failuresData || [],
        version: currentVersion
      };
      
      // Update cache with new data
      cachedDataRef.current = result;
      cacheExpiryRef.current = now + CACHE_TTL;
      
      return result;
      
    } catch (error) {
      // Only process error if the request wasn't aborted
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Fetch aborted');
        return null;
      }
      
      console.error("Error loading habit data:", error);
      const errorMessage = handleApiError(error, "loading habit data", "Failed to load habit data. Please try again.", false);
      return { error: errorMessage, version: currentVersion };
      
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [today, trackPromise, user]);

  // Function to setup abort controller and handle fetch request with cache control
  const loadData = useCallback(async (showLoading = true, forceRefresh = false) => {
    // Skip if not authenticated
    if (!user) {
      console.log("Skipping loadData - user not authenticated");
      return { habits: [], completions: [], failures: [], version: 0 };
    }
    
    try {
      // Cancel any in-flight requests
      cancelPendingRequests();
      
      // Setup new controller
      const controller = createAbortController();
      const signal = controller.signal;
      
      // Invalidate cache if force refresh requested
      if (forceRefresh) {
        console.log("Forcing data refresh (cache invalidated)");
        cacheExpiryRef.current = 0;
        cachedDataRef.current = null;
      }
      
      const result = await fetchHabitData(signal);
      
      if (result?.error && showLoading) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please try again.",
          variant: "destructive",
        });
      }
      
      // Added debugging for result
      if (!result) {
        console.log("Fetch returned null result (likely throttled)");
      } else {
        console.log(`Fetch completed with ${result.habits?.length || 0} habits`);
      }
      
      return result;
    } catch (error) {
      console.error("Unexpected error in loadData:", error);
      return { error: "An unexpected error occurred while loading data", habits: [], completions: [], failures: [], version: 0 };
    }
  }, [fetchHabitData, createAbortController, cancelPendingRequests, user]);

  // Added ability to clear cache explicitly
  const clearCache = useCallback(() => {
    cachedDataRef.current = null;
    cacheExpiryRef.current = 0;
    console.log("Cache cleared");
  }, []);
  
  return {
    loadData,
    cancelPendingRequests,
    getCurrentVersion: () => dataVersionRef.current,
    clearCache
  };
}
