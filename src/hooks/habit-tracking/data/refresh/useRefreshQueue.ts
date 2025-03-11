
import { useRef, useCallback } from "react";

/**
 * Hook to manage queue of refresh requests
 */
export function useRefreshQueue() {
  const refreshInProgressRef = useRef(false);
  const refreshQueuedRef = useRef(false);
  
  // Check if refresh is in progress
  const isRefreshInProgress = useCallback(() => {
    return refreshInProgressRef.current;
  }, []);
  
  // Check if there's a queued refresh
  const hasQueuedRefresh = useCallback(() => {
    return refreshQueuedRef.current;
  }, []);
  
  // Mark refresh as started
  const markRefreshStarted = useCallback(() => {
    refreshInProgressRef.current = true;
  }, []);
  
  // Mark refresh as completed
  const markRefreshCompleted = useCallback(() => {
    refreshInProgressRef.current = false;
  }, []);
  
  // Queue a refresh
  const queueRefresh = useCallback(() => {
    refreshQueuedRef.current = true;
  }, []);
  
  // Clear queued refresh
  const clearQueuedRefresh = useCallback(() => {
    refreshQueuedRef.current = false;
  }, []);
  
  return {
    isRefreshInProgress,
    hasQueuedRefresh,
    markRefreshStarted,
    markRefreshCompleted,
    queueRefresh,
    clearQueuedRefresh
  };
}
