
import { useState, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  getTodayFormatted
} from "@/lib/habits";
import { HabitTrackingState } from "./types";
import { useHabitFiltering } from "./useHabitFiltering";
import { withRetry } from "@/lib/error-utils";

/**
 * Hook to manage loading habit data from the API with improved reliability
 */
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
  
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);
  const initialLoadCompletedRef = useRef(false);
  const dataLoadTimerRef = useRef<number | null>(null);
  const retryAttemptsRef = useRef(0);
  const { filterHabitsForToday } = useHabitFiltering();
  const today = getTodayFormatted();

  // Enhanced data loading with auto-retry capability for transient errors
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // Strict debouncing: Prevent rapid successive calls with exponential backoff for errors
    const now = Date.now();
    const minInterval = retryAttemptsRef.current > 0 
      ? Math.min(2000 * Math.pow(1.5, retryAttemptsRef.current), 10000)  // Exponential backoff, max 10 seconds
      : 300;  // Further reduced initial delay to improve responsiveness
      
    if (now - lastFetchTimeRef.current < minInterval) {
      console.log(`Skipping data fetch - too soon since last fetch (${Math.round((now - lastFetchTimeRef.current)/1000)}s < ${Math.round(minInterval/1000)}s)`);
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Track loading state
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    } else {
      setState(prev => ({ ...prev, error: null }));
    }
    
    try {      
      console.log('Fetching habit data with timestamp:', now);
      
      // Use withRetry for data fetching to improve reliability, increased retry attempts
      const [habitsData, completionsData, failuresData] = await Promise.all([
        withRetry(() => fetchHabits(), 5),  // Increased retry attempts
        withRetry(() => getCompletionsForDate(today), 5),
        withRetry(() => getFailuresForDate(today), 5)
      ]);
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      // Explicitly handle null or undefined data
      if (!habitsData || habitsData.length === undefined) {
        throw new Error("Failed to fetch habits data - received invalid response");
      }
      
      const filtered = filterHabitsForToday(habitsData || []);
      console.log(`Loaded ${habitsData.length} habits, filtered to ${filtered.length} for today`);
      
      // Reset retry counter on success
      retryAttemptsRef.current = 0;
      
      // Update all state at once to prevent multiple rerenders
      setState({
        habits: habitsData || [],
        filteredHabits: filtered,
        completions: completionsData || [],
        failures: failuresData || [],
        isInitialized: true,
        loading: false,
        error: null
      });
      
      initialLoadCompletedRef.current = true;
      
      // Notify parent components that data has changed
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      console.error("Error loading habit data:", error);
      
      if (!isMountedRef.current) return;
      
      // Increment retry counter to trigger backoff
      retryAttemptsRef.current += 1;
      
      // Provide more specific error messages based on retry attempts
      let errorMessage = "Failed to load habit data. Please try again.";
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      if (retryAttemptsRef.current > 1) {
        errorMessage = `We're having trouble connecting to the server (Attempt ${retryAttemptsRef.current}). Please check your connection.`;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isInitialized: initialLoadCompletedRef.current // Keep initialized state if we had successfully loaded before
      }));
      
      // Only show toast for user-initiated loads
      if (showLoading) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Try again automatically if it's not a user-initiated load and within retry limit
      if (!showLoading && retryAttemptsRef.current <= 5) {
        const retryDelay = 3000 * Math.pow(1.5, retryAttemptsRef.current - 1);
        console.log(`Scheduling automatic retry in ${Math.round(retryDelay/1000)}s...`);
        
        if (dataLoadTimerRef.current) {
          window.clearTimeout(dataLoadTimerRef.current);
        }
        
        dataLoadTimerRef.current = window.setTimeout(() => {
          if (isMountedRef.current) {
            console.log("Executing automatic retry...");
            loadData(false);
          }
        }, retryDelay);
      }
    }
  }, [filterHabitsForToday, today, onHabitChange]);

  // Improved debounce function with better timing and cleanup
  const debouncedLoadData = useCallback((showLoading = true) => {
    if (dataLoadTimerRef.current) {
      window.clearTimeout(dataLoadTimerRef.current);
    }
    
    dataLoadTimerRef.current = window.setTimeout(() => {
      loadData(showLoading);
    }, 100); // Reduced timing for quicker response
  }, [loadData]);

  return {
    state,
    loadData,
    debouncedLoadData,
    dataLoadTimerRef,
    isMountedRef,
    initialLoadCompletedRef,
    lastFetchTimeRef
  };
}
