
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  getTodayFormatted
} from "@/lib/habits";
import { HabitTrackingState } from "./types";
import { useHabitFiltering } from "./useHabitFiltering";
import { withRetry, handleApiError } from "@/lib/error-utils";

export function useHabitData(onHabitChange?: () => void) {
  const [state, setState] = useState<HabitTrackingState>({
    habits: [],
    filteredHabits: [],
    completions: [],
    failures: [],
    loading: true,
    error: null,
    isInitialized: false
  });
  
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(0);
  const dataVersionRef = useRef(0);
  const { filterHabitsForToday } = useHabitFiltering();
  const today = getTodayFormatted();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Enhanced data loading with improved error handling, request cancellation, and versioning
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // Request throttling (500ms)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Increment data version to track current request
    const currentVersion = ++dataVersionRef.current;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // Only update loading state if explicitly requested
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {      
      // Optimized data fetching with parallel requests and better error handling
      const [habitsData, completionsData, failuresData] = await Promise.all([
        withRetry(() => fetchHabits(), 2, signal),
        withRetry(() => getCompletionsForDate(today), 2, signal),
        withRetry(() => getFailuresForDate(today), 2, signal)
      ]);
      
      // Version check to prevent race conditions - only apply latest data
      if (!isMountedRef.current || dataVersionRef.current !== currentVersion) {
        console.log('Ignoring stale data from version', currentVersion, 'current is', dataVersionRef.current);
        return;
      }
      
      if (!habitsData) {
        throw new Error("Failed to fetch habits data");
      }
      
      // Apply filtered habits
      const filtered = filterHabitsForToday(habitsData);
      console.log('Filtered habits for today:', filtered.length, 'out of', habitsData.length);
      
      // Update state in a single operation with immutable update pattern
      setState(prev => ({
        ...prev,
        habits: habitsData,
        filteredHabits: filtered,
        completions: completionsData || [],
        failures: failuresData || [],
        isInitialized: true,
        loading: false,
        error: null
      }));
      
      // Notify parent if needed
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      // Only process error if the request wasn't aborted
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      
      console.error("Error loading habit data:", error);
      
      // Version check for errors too
      if (!isMountedRef.current || dataVersionRef.current !== currentVersion) {
        return;
      }
      
      // Set error state with better error messaging
      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error, "loading habit data", "Failed to load habit data. Please try again."),
      }));
      
      // Only show toast for user-initiated loads
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [filterHabitsForToday, today, onHabitChange]);

  // Simplified refresh function with abort handling and version check
  const refreshData = useCallback((showLoading = true) => {
    if (isMountedRef.current) {
      loadData(showLoading);
    }
  }, [loadData]);

  // Enhanced cleanup effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any in-flight requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // More efficient visibility change handler with better debouncing
  useEffect(() => {
    let visibilityTimeout: number | null = null;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        // Clear existing timeout if it exists
        if (visibilityTimeout) {
          window.clearTimeout(visibilityTimeout);
        }
        
        // Debounce the refresh to prevent multiple calls
        visibilityTimeout = window.setTimeout(() => {
          refreshData(false);
          visibilityTimeout = null;
        }, 300);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (visibilityTimeout) {
        window.clearTimeout(visibilityTimeout);
      }
    };
  }, [refreshData]);

  return {
    state,
    setState, // Expose setState to allow direct updates from actions
    loadData,
    refreshData
  };
}
