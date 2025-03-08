
import { useCallback, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { HabitTrackingState } from "./types";
import { useHabitFetcher } from "./data/useHabitFetcher";
import { useHabitStateManager } from "./data/useHabitStateManager";
import { useVisibilityManager } from "./utils/useVisibilityManager";

export function useHabitData(onHabitChange?: () => void) {
  const { loadData, cancelPendingRequests, getCurrentVersion } = useHabitFetcher();
  const { state, setState, updateHabits, setLoading, setError } = useHabitStateManager();
  const isInitializedRef = useRef(false);

  // Simplified refresh function
  const refreshData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    const result = await loadData(showLoading);
    
    if (!result) return; // Request was throttled or aborted
    
    if (result.error) {
      setError(result.error);
      return;
    }
    
    // Update state with new data
    updateHabits(result.habits);
    
    setState(prev => ({
      ...prev,
      completions: result.completions,
      failures: result.failures,
      loading: false,
      error: null,
      isInitialized: true
    }));
    
    // Notify parent if needed
    if (onHabitChange) {
      onHabitChange();
    }
    
    console.log(`Data fetch complete (version ${result.version}):`, {
      habits: result.habits.length,
      filtered: state.filteredHabits.length,
      completions: result.completions.length,
      failures: result.failures.length
    });
  }, [loadData, onHabitChange, setError, setLoading, setState, state.filteredHabits.length, updateHabits]);

  // Handle visibility changes by refreshing data
  const { isMounted } = useVisibilityManager(() => {
    if (isInitializedRef.current) {
      refreshData(false);
    }
  });

  // Initial data load on component mount - only once with better tracking
  useEffect(() => {
    if (!isInitializedRef.current) {
      const timeout = setTimeout(() => {
        console.log("[useHabitData] Initial mount, triggering data refresh");
        refreshData(true);
        isInitializedRef.current = true;
      }, 50); // Small delay to avoid concurrent rendering issues
      
      return () => clearTimeout(timeout);
    }
  }, [refreshData]);

  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  return {
    state,
    setState,
    loadData: refreshData,
    refreshData
  };
}
