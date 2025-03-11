
import { useRef, useCallback } from "react";

/**
 * Hook to handle request throttling logic for API calls
 */
export function useRequestThrottling() {
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  
  // Constants for throttling
  const THROTTLE_MS = 500; // 500ms minimum between requests
  
  // Check if a request should be throttled
  const shouldThrottle = useCallback(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (fetchInProgressRef.current) {
      console.log("Fetch already in progress, waiting...");
      return true;
    }
    
    if (timeSinceLastFetch < THROTTLE_MS) {
      console.log(`Throttling fetch request (${timeSinceLastFetch}ms since last fetch)`);
      return true;
    }
    
    return false;
  }, []);
  
  // Mark fetch as started
  const markFetchStarted = useCallback(() => {
    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = Date.now();
    return Date.now();
  }, []);
  
  // Mark fetch as completed
  const markFetchCompleted = useCallback(() => {
    fetchInProgressRef.current = false;
  }, []);
  
  return {
    shouldThrottle,
    markFetchStarted,
    markFetchCompleted
  };
}
