
import { useEffect, useRef } from "react";
import { useVisibilityManager } from "../utils/useVisibilityManager";

/**
 * Hook to handle refreshing data when tab becomes visible
 */
export function useVisibilityRefresh(
  refreshData: (showLoading: boolean, forceRefresh: boolean) => void,
  lastRefreshTime: Date | null,
  staleThreshold: number = 60000 // 60 seconds
) {
  const isInitializedRef = useRef(false);

  // Handle visibility changes - only refresh if data is stale
  useVisibilityManager(() => {
    if (isInitializedRef.current) {
      const now = new Date();
      
      if (!lastRefreshTime || now.getTime() - lastRefreshTime.getTime() > staleThreshold) {
        console.log("Tab visible, refreshing stale data");
        refreshData(false, true); // Force refresh when coming back after a long time
      } else {
        console.log("Tab visible, but data is fresh - no refresh needed");
      }
    }
  });

  // Mark as initialized
  useEffect(() => {
    isInitializedRef.current = true;
  }, []);

  return {
    isInitializedRef
  };
}
