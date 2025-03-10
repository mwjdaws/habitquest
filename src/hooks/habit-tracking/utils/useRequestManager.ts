
import { useRef, useCallback } from "react";

/**
 * Hook for managing API requests with cancellation and tracking
 */
export function useRequestManager() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingActionsRef = useRef<Set<string>>(new Set());
  const pendingPromisesRef = useRef<Set<Promise<any>>>(new Set());
  
  // Check if an action is pending
  const isActionPending = useCallback((actionKey: string) => {
    return pendingActionsRef.current.has(actionKey);
  }, []);
  
  // Start tracking an action
  const trackAction = useCallback((actionKey: string) => {
    pendingActionsRef.current.add(actionKey);
  }, []);
  
  // Finish tracking an action
  const finishAction = useCallback((actionKey: string) => {
    pendingActionsRef.current.delete(actionKey);
  }, []);
  
  // Track a promise
  const trackPromise = useCallback((promise: Promise<any>) => {
    pendingPromisesRef.current.add(promise);
    // Remove promise when done
    promise.finally(() => {
      pendingPromisesRef.current.delete(promise);
    });
    return promise;
  }, []);
  
  // Cancel all pending requests
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    pendingActionsRef.current.clear();
    pendingPromisesRef.current.clear();
  }, []);
  
  // Create a new abort controller
  const createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);
  
  return {
    isActionPending,
    trackAction,
    finishAction,
    trackPromise,
    cancelPendingRequests,
    createAbortController,
    pendingActionsRef,
    pendingPromisesRef
  };
}
