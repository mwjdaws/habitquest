
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
 * Hook to handle habit data fetching with improved error handling and cancellation
 */
export function useHabitFetcher() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const dataVersionRef = useRef(0);
  const today = getTodayFormatted();

  // Enhanced data loading with improved error handling, request cancellation, and versioning
  const fetchHabitData = useCallback(async (signal?: AbortSignal) => {
    // Request throttling (500ms)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      console.log("Throttling fetch request");
      return null;
    }
    
    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
    
    // Increment data version to track current request
    const currentVersion = ++dataVersionRef.current;
    console.log(`Starting data fetch (version ${currentVersion})`);
    
    try {      
      // Optimized data fetching with parallel requests and better error handling
      const [habitsData, completionsData, failuresData] = await Promise.all([
        withRetry(() => fetchHabits(), 2, signal),
        withRetry(() => getCompletionsForDate(today), 2, signal),
        withRetry(() => getFailuresForDate(today), 2, signal)
      ]);
      
      if (!habitsData) {
        throw new Error("Failed to fetch habits data");
      }
      
      return {
        habits: habitsData,
        completions: completionsData || [],
        failures: failuresData || [],
        version: currentVersion
      };
      
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

  // Function to setup abort controller and handle fetch request
  const loadData = useCallback(async (showLoading = true) => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Aborting previous fetch");
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
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

  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  return {
    loadData,
    cancelPendingRequests,
    getCurrentVersion: () => dataVersionRef.current
  };
}
