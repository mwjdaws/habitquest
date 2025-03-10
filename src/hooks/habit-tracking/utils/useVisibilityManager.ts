
import { useEffect, useRef, useCallback } from "react";

type VisibilityOptions = {
  debounceMs?: number;
  onMount?: () => void;
};

/**
 * Hook to manage visibility change events with better debouncing
 */
export function useVisibilityManager(
  onVisible: () => void, 
  options: VisibilityOptions = {}
) {
  const { debounceMs = 300, onMount } = options;
  const isMountedRef = useRef(true);
  
  // Enhanced visibility change handler with better debouncing
  useEffect(() => {
    let visibilityTimeout: number | null = null;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        // Clear existing timeout if it exists
        if (visibilityTimeout) {
          window.clearTimeout(visibilityTimeout);
        }
        
        // Debounce the refresh to prevent multiple calls
        visibilityTimeout = window.setTimeout(() => {
          console.log("Tab became visible, refreshing data");
          onVisible();
          visibilityTimeout = null;
        }, debounceMs);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Call onMount handler if provided
    if (onMount && isMountedRef.current) {
      onMount();
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (visibilityTimeout) {
        window.clearTimeout(visibilityTimeout);
      }
    };
  }, [onVisible, debounceMs, onMount]);
  
  // Cleanup effect for component unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Check if component is mounted
  const isMounted = useCallback(() => {
    return isMountedRef.current;
  }, []);
  
  return { isMounted };
}
