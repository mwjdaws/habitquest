
import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  getTodayFormatted
} from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { withRetry, handleApiError } from "@/lib/error-utils";
import { Habit } from "@/lib/habitTypes";

/**
 * Hook to handle habit data fetching with improved error handling, cancellation, and caching
 */
export function useHabitFetcher() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const dataVersionRef = useRef(0);
  const cacheExpiryRef = useRef(0);
  const cachedDataRef = useRef<any>(null);
  const today = getTodayFormatted();
  
  // Track pending promises to improve cancellation logic
  const pendingPromisesRef = useRef<Set<Promise<any>>>(new Set());

  // Enhanced data loading with improved error handling, request cancellation, and batch fetching
  const fetchHabitData = useCallback(async (signal?: AbortSignal) => {
    // Improved request throttling
    const now = Date.now();
    
    // Cache is valid for 30 seconds unless force refresh is requested
    const CACHE_TTL = 30000; // 30 seconds
    const THROTTLE_MS = 700; // 700ms minimum between requests
    
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
      // BATCH API OPTIMIZATION: Fetch all data with a single API call if possible
      // If backend supports batch fetching, we would use it here
      // For now, still using parallel requests but with improved cancellation and caching
      
      // Create fetch promises with retry and abort signal
      const habitsPromise = withRetry(() => fetchHabits(), 2, signal);
      const completionsPromise = withRetry(() => getCompletionsForDate(today), 2, signal);
      const failuresPromise = withRetry(() => getFailuresForDate(today), 2, signal);
      
      // Add promises to tracking set
      pendingPromisesRef.current.add(habitsPromise);
      pendingPromisesRef.current.add(completionsPromise);
      pendingPromisesRef.current.add(failuresPromise);
      
      // Optimized data fetching with parallel requests
      const [habitsData, completionsData, failuresData] = await Promise.all([
        habitsPromise,
        completionsPromise,
        failuresPromise
      ]);
      
      // Remove completed promises from tracking set
      pendingPromisesRef.current.delete(habitsPromise);
      pendingPromisesRef.current.delete(completionsPromise);
      pendingPromisesRef.current.delete(failuresPromise);
      
      if (signal?.aborted) {
        console.log('Fetch aborted mid-operation');
        return null;
      }
      
      if (!habitsData) {
        throw new Error("Failed to fetch habits data");
      }
      
      // Cache the result
      const result = {
        habits: habitsData,
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
  }, [today]);

  // Function to setup abort controller and handle fetch request with cache control
  const loadData = useCallback(async (showLoading = true, forceRefresh = false) => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Aborting previous fetch");
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // Invalidate cache if force refresh requested
    if (forceRefresh) {
      cacheExpiryRef.current = 0;
      console.log("Forcing data refresh (cache invalidated)");
    }
    
    const result = await fetchHabitData(signal);
    
    if (result?.error && showLoading) {
      toast({
        title: "Error",
        description: "Failed to load habit data. Please try again.",
        variant: "destructive",
      });
    }
    
    return result;
  }, [fetchHabitData]);

  // Improved cancellation that aborts all pending requests
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Log count of pending promises being canceled
    console.log(`Canceling ${pendingPromisesRef.current.size} pending promises`);
    pendingPromisesRef.current.clear();
  }, []);

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
