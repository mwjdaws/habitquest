
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

  // Simplified data loading with error handling
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // Simple throttling
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Track loading state
    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {      
      console.log('Fetching habit data');
      
      // Simplified data fetching with retry
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
      
      // Update state
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
      
      // Set error state
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load habit data",
        isInitialized: prev.isInitialized
      }));
      
      // Show toast for user-initiated loads
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [filterHabitsForToday, today, onHabitChange]);

  // Simple wrapper for refresh with debounce
  const refreshData = useCallback((showLoading = true) => {
    setTimeout(() => {
      if (isMountedRef.current) {
        loadData(showLoading);
      }
    }, 100);
  }, [loadData]);

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Setup visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
