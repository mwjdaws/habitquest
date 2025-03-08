
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
  const { filterHabitsForToday } = useHabitFiltering();
  const today = getTodayFormatted();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Enhanced data loading with improved error handling and request cancellation
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // Request throttling (500ms)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Only update loading state if explicitly requested
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {      
      // Optimized data fetching with parallel requests and better error handling
      const [habitsData, completionsData, failuresData] = await Promise.all([
        withRetry(() => fetchHabits(), 2),
        withRetry(() => getCompletionsForDate(today), 2),
        withRetry(() => getFailuresForDate(today), 2)
      ]);
      
      if (!isMountedRef.current) return;
      
      if (!habitsData) {
        throw new Error("Failed to fetch habits data");
      }
      
      const filtered = filterHabitsForToday(habitsData);
      
      // Update state in a single operation with immutable update pattern
      setState({
        habits: habitsData,
        filteredHabits: filtered,
        completions: completionsData || [],
        failures: failuresData || [],
        isInitialized: true,
        loading: false,
        error: null
      });
      
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
      
      if (!isMountedRef.current) return;
      
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

  // Simplified refresh function with abort handling
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

  // More efficient visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        refreshData(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshData]);

  return {
    state,
    loadData,
    refreshData
  };
}
