
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
import { withRetry } from "@/lib/error-utils";

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

  // Optimized data loading with improved error handling
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // More efficient throttling (1 second)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 1000) {
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Only update loading state if explicitly requested
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {      
      // Optimized data fetching with parallel requests
      const [habitsData, completionsData, failuresData] = await Promise.all([
        withRetry(() => fetchHabits(), 3),
        withRetry(() => getCompletionsForDate(today), 3),
        withRetry(() => getFailuresForDate(today), 3)
      ]);
      
      if (!isMountedRef.current) return;
      
      // Safety check for data
      if (!habitsData) {
        throw new Error("Failed to fetch habits data");
      }
      
      const filtered = filterHabitsForToday(habitsData);
      
      // Update state in a single operation to reduce renders
      setState({
        habits: habitsData,
        filteredHabits: filtered,
        completions: completionsData || [],
        failures: failuresData || [],
        isInitialized: true,
        loading: false,
        error: null
      });
      
      // Notify parent
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      console.error("Error loading habit data:", error);
      
      if (!isMountedRef.current) return;
      
      // Set error state without changing other state values
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load habit data",
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

  // Simplified refresh function without unnecessary setTimeout
  const refreshData = useCallback((showLoading = true) => {
    if (isMountedRef.current) {
      loadData(showLoading);
    }
  }, [loadData]);

  // Cleanup effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Optimized visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        // Use a small delay to allow other visibility handlers to complete
        const timeoutId = window.setTimeout(() => {
          if (isMountedRef.current) {
            refreshData(false);
          }
        }, 300);
        
        return () => window.clearTimeout(timeoutId);
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
