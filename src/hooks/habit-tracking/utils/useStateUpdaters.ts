
import { useCallback } from "react";
import { HabitTrackingState } from "../types";

/**
 * Hook that provides a set of optimized state update functions for habit tracking
 * 
 * This hook centralizes all state update operations, ensuring consistent state
 * mutation patterns and reducing callback recreation through useCallback.
 *
 * @param {React.Dispatch<React.SetStateAction<HabitTrackingState>>} setState - State setter function
 * @returns {Object} Collection of memoized state update functions
 * 
 * @example
 * const { setLoading, setError, updateCompletions } = useStateUpdaters(setState);
 * // Later: setLoading(true);
 */
export function useStateUpdaters(
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>
) {
  /**
   * Updates the loading state
   * @param {boolean} loading - New loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, [setState]);
  
  /**
   * Updates the error state and automatically sets loading to false
   * @param {string | null} error - Error message or null to clear
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, [setState]);
  
  /**
   * Updates the completions array and sets loading to false
   * @param {any[]} completions - New completions array
   */
  const updateCompletions = useCallback((completions: any[]) => {
    setState(prev => ({
      ...prev,
      completions,
      loading: false
    }));
  }, [setState]);
  
  /**
   * Updates the failures array and sets loading to false
   * @param {any[]} failures - New failures array
   */
  const updateFailures = useCallback((failures: any[]) => {
    setState(prev => ({
      ...prev,
      failures,
      loading: false
    }));
  }, [setState]);
  
  /**
   * Resets the entire state to match initialState
   * @param {HabitTrackingState} initialState - State to reset to
   */
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
