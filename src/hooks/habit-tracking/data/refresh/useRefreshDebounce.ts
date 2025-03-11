
import { useRef, useCallback } from "react";

/**
 * Hook to handle debouncing of refresh requests
 */
export function useRefreshDebounce(debounceMs: number = 50) {
  const refreshDebounceTimerRef = useRef<number | null>(null);
  
  // Clear any existing debounce timer
  const clearDebounceTimer = useCallback(() => {
    if (refreshDebounceTimerRef.current) {
      window.clearTimeout(refreshDebounceTimerRef.current);
      refreshDebounceTimerRef.current = null;
    }
  }, []);
  
  // Set a debounce timer with a callback
  const setDebounceTimer = useCallback((callback: () => void, skipDebounce: boolean = false) => {
    clearDebounceTimer();
    
    if (skipDebounce) {
      callback();
      return null;
    }
    
    refreshDebounceTimerRef.current = window.setTimeout(() => {
      callback();
      refreshDebounceTimerRef.current = null;
    }, debounceMs);
    
    return refreshDebounceTimerRef.current;
  }, [clearDebounceTimer, debounceMs]);
  
  return {
    clearDebounceTimer,
    setDebounceTimer,
    hasActiveDebounce: useCallback(() => refreshDebounceTimerRef.current !== null, [])
  };
}
