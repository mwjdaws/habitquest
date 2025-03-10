
import { useState, useEffect, useCallback } from "react";
import { fetchHabits } from "@/lib/api/habit"; 
import { getCompletionTrends, getFailureTrends, getStreakRecords } from "@/lib/api/trendAPI";
import { Habit } from "@/lib/habitTypes";
import { useTimeFilter } from "./utils/useTimeFilter";
import { safeApiCall } from "@/lib/error-utils";

export interface TrendData {
  habits: Habit[];
  completions: any[];
  failures: any[];
  streakRecords: any[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing habit trend data with time filtering
 */
export function useTrendData() {
  // Use the improved useTimeFilter hook
  const { timeFilter, setTimeFilter, getDays } = useTimeFilter("week");
  
  const [data, setData] = useState<TrendData>({
    habits: [],
    completions: [],
    failures: [],
    streakRecords: [],
    loading: true,
    error: null
  });

  const fetchTrendData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const days = getDays();
      
      // Use Promise.all for concurrent fetching with the new safeApiCall utility
      // Pass proper string values for the error message parameter
      const [habitsResult, completionsResult, failuresResult, streakRecordsResult] = await Promise.all([
        safeApiCall(() => fetchHabits(), "fetching habits", "Failed to fetch habits", false),
        safeApiCall(() => getCompletionTrends(days), "fetching completion trends", "Failed to fetch completion trends", false),
        safeApiCall(() => getFailureTrends(days), "fetching failure trends", "Failed to fetch failure trends", false),
        safeApiCall(() => getStreakRecords(), "fetching streak records", "Failed to fetch streak records", false)
      ]);
      
      // Check if any of the API calls failed
      const errorResults = [habitsResult, completionsResult, failuresResult, streakRecordsResult]
        .filter(result => !result.success);
      
      if (errorResults.length > 0) {
        // Use the first error as the main error
        const firstError = errorResults[0].error || "Failed to load trend data";
        throw new Error(firstError);
      }
      
      // Ensure we're setting arrays for each property, even if the API returned undefined
      setData({
        habits: Array.isArray(habitsResult.data) ? habitsResult.data : [],
        completions: Array.isArray(completionsResult.data) ? completionsResult.data : [],
        failures: Array.isArray(failuresResult.data) ? failuresResult.data : [],
        streakRecords: Array.isArray(streakRecordsResult.data) ? streakRecordsResult.data : [],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching trend data:", error);
      
      // Explicitly create a new object with all array fields properly initialized
      setData({
        habits: [],
        completions: [],
        failures: [],
        streakRecords: [],
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load habit trend data"
      });
    }
  }, [getDays]);

  // Fetch data when the time filter changes
  useEffect(() => {
    fetchTrendData();
  }, [fetchTrendData]);

  return {
    ...data,
    timeFilter,
    setTimeFilter,
    refreshData: fetchTrendData
  };
}
