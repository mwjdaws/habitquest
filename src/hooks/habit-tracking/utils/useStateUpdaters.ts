
import { useCallback } from "react";
import { HabitTrackingState } from "../types";

/**
 * Hook providing standard state update functions for habit tracking
 */
export function useStateUpdaters(
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>
) {
  // Update for loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, [setState]);
  
  // Update for error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, [setState]);
  
  // Update completions
  const updateCompletions = useCallback((completions: any[]) => {
    setState(prev => ({
      ...prev,
      completions,
      loading: false
    }));
  }, [setState]);
  
  // Update failures
  const updateFailures = useCallback((failures: any[]) => {
    setState(prev => ({
      ...prev,
      failures,
      loading: false
    }));
  }, [setState]);
  
  // Reset state to initial values
  const resetState = useCallback((initialState: HabitTrackingState) => {
    setState(initialState);
  }, [setState]);
  
  return {
    setLoading,
    setError,
    updateCompletions,
    updateFailures,
    resetState
  };
}
