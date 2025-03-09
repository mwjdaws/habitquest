
import { useCallback } from "react";
import { HabitTrackingState } from "../types";

/**
 * Hook for optimized habit state update functions
 */
export function useHabitStateUpdate(setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>) {
  // Optimized update for completions
  const updateCompletions = useCallback((completions: any[]) => {
    setState(prev => ({
      ...prev,
      completions,
      loading: false
    }));
  }, [setState]);
  
  // Optimized update for failures
  const updateFailures = useCallback((failures: any[]) => {
    setState(prev => ({
      ...prev,
      failures,
      loading: false
    }));
  }, [setState]);
  
  // Optimized update for loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, [setState]);
  
  // Optimized update for error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, [setState]);
  
  return {
    updateCompletions,
    updateFailures,
    setLoading,
    setError
  };
}
