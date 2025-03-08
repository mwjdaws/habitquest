
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

/**
 * Hook to manage loading habit data from the API
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
  const { filterHabitsForToday } = useHabitFiltering();
  const today = getTodayFormatted();

  // Dramatically improved data loading with proper debouncing and error handling
  const loadData = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    // Strict debouncing: Prevent rapid successive calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000) {
      console.log('Skipping data fetch - too soon since last fetch');
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
      console.log('Fetching habit data...');
      
      // Use Promise.all to fetch data in parallel for better performance
      const [habitsData, completionsData, failuresData] = await Promise.all([
        fetchHabits(),
        getCompletionsForDate(today),
        getFailuresForDate(today)
      ]);
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      const filtered = filterHabitsForToday(habitsData || []);
      console.log(`Loaded ${habitsData.length} habits, filtered to ${filtered.length} for today`);
      
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
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load habit data. Please try again."
      }));
      
      // Only show toast for user-initiated loads
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please refresh.",
          variant: "destructive",
        });
      }
    }
  }, [filterHabitsForToday, today, onHabitChange]);

  // Improved debounce function that prevents rapid calls
  const debouncedLoadData = useCallback((showLoading = true) => {
    if (dataLoadTimerRef.current) {
      window.clearTimeout(dataLoadTimerRef.current);
    }
    
    dataLoadTimerRef.current = window.setTimeout(() => {
      loadData(showLoading);
    }, 300);
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
