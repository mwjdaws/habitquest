
import { useCallback } from "react";
import { withRetry, handleApiError } from "@/lib/error-utils";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  getTodayFormatted
} from "@/lib/habits";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to handle the core data fetching logic for habits, completions, and failures
 */
export function useHabitFetch() {
  const { user } = useAuth();
  
  // Core data fetching function with retry capability
  const fetchHabitData = useCallback(async (signal?: AbortSignal, selectedDate: string = getTodayFormatted()) => {
    // Skip if not authenticated
    if (!user) {
      console.log("Skipping habit data fetch - user not authenticated");
      return { habits: [], completions: [], failures: [], version: 0 };
    }
    
    // Check for aborted signal first
    if (signal?.aborted) {
      console.log('Fetch aborted before starting');
      return null;
    }
    
    try {
      // Create fetch promises with retry and abort signal
      const habitsPromise = withRetry(() => fetchHabits(), 2, signal);
      const completionsPromise = withRetry(() => getCompletionsForDate(selectedDate), 2, signal);
      const failuresPromise = withRetry(() => getFailuresForDate(selectedDate), 2, signal);
      
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
      
      console.log(`Habits data fetched successfully for date ${selectedDate}:`, habitsData?.length || 0, "habits");
      
      return {
        habits: habitsData || [],
        completions: completionsData || [],
        failures: failuresData || [],
      };
      
    } catch (error) {
      // Only process error if the request wasn't aborted
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Fetch aborted');
        return null;
      }
      
      console.error("Error loading habit data:", error);
      const errorMessage = handleApiError(error, "loading habit data", "Failed to load habit data. Please try again.", false);
      return { error: errorMessage };
    }
  }, [user]);
  
  return { fetchHabitData };
}
