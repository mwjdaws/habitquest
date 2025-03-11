
import { useEffect, useRef } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export function useHabitInitialization(
  isAuthenticated: boolean,
  habits: any[],
  loading: boolean,
  refreshData: (showLoading?: boolean, forceRefresh?: boolean) => void
) {
  const didInitialRefreshRef = useRef(false);
  const dataFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial data load on component mount
  useEffect(() => {
    if (isAuthenticated && !didInitialRefreshRef.current) {
      console.log("[HabitTracker] Component mounted, initializing data");
      didInitialRefreshRef.current = true;
      
      // Clear any existing timeout
      if (dataFetchTimeoutRef.current) {
        clearTimeout(dataFetchTimeoutRef.current);
      }
      
      // Delay slightly to avoid race conditions during initial mounting
      dataFetchTimeoutRef.current = setTimeout(() => {
        console.log("[HabitTracker] Triggering initial data refresh");
        refreshData(true, true);
      }, 200);
    }
    
    return () => {
      if (dataFetchTimeoutRef.current) {
        clearTimeout(dataFetchTimeoutRef.current);
      }
    };
  }, [refreshData, isAuthenticated]);
  
  // Add an effect to retry if auth state changes after mount
  useEffect(() => {
    if (isAuthenticated && didInitialRefreshRef.current && !habits.length && !loading) {
      console.log("[HabitTracker] Auth state changed, retrying data fetch");
      refreshData(true, true);
    }
  }, [isAuthenticated, habits.length, loading, refreshData]);
}
