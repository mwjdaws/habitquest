
import { useState, useCallback, useRef } from "react";

/**
 * Hook to manage refresh throttling logic
 */
export function useRefreshThrottling(throttleMs: number = 800) {
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  // Check if refresh should be throttled
  const shouldThrottleRefresh = useCallback((forceRefresh: boolean) => {
    if (forceRefresh) return false;
    
    const now = new Date();
    const elapsed = lastRefreshTime 
      ? now.getTime() - lastRefreshTime.getTime() 
      : throttleMs + 1;
    
    return elapsed < throttleMs;
  }, [lastRefreshTime, throttleMs]);
  
  // Mark a refresh as completed
  const markRefreshComplete = useCallback(() => {
    setLastRefreshTime(new Date());
    setRefreshAttempts(prev => prev + 1);
  }, []);
  
  // Calculate time until next available refresh
  const getTimeUntilAvailable = useCallback(() => {
    if (!lastRefreshTime) return 0;
    
    const now = new Date();
    const elapsed = now.getTime() - lastRefreshTime.getTime();
    return Math.max(0, throttleMs - elapsed);
  }, [lastRefreshTime, throttleMs]);
  
  // Clear any timers
  const clearThrottleTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  return {
    lastRefreshTime,
    refreshAttempts,
    shouldThrottleRefresh,
    markRefreshComplete,
    getTimeUntilAvailable,
    clearThrottleTimer
  };
}
