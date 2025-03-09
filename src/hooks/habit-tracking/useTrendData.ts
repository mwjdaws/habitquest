
import { useState, useEffect, useCallback } from "react";
import { fetchHabits } from "@/lib/api/habitCrudAPI";
import { getCompletionTrends, getFailureTrends, getStreakRecords } from "@/lib/api/trendAPI";
import { Habit } from "@/lib/habitTypes";
import { toast } from "@/components/ui/use-toast";

export type TimeFilter = "week" | "month" | "all";

export interface TrendData {
  habits: Habit[];
  completions: any[];
  failures: any[];
  streakRecords: any[];
  loading: boolean;
  error: string | null;
}

/**
 * Helper function to determine days from time filter
 */
const getDaysFromFilter = (filter: TimeFilter): number => {
  switch (filter) {
    case "week":
      return 7;
    case "month":
      return 30;
    case "all":
      return 365; // Using a year as "all" time to prevent too large requests
    default:
      return 7;
  }
};

export function useTrendData() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
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
      
      const days = getDaysFromFilter(timeFilter);
      
      const [habitsData, completionsData, failuresData, streakRecordsData] = await Promise.all([
        fetchHabits(),
        getCompletionTrends(days),
        getFailureTrends(days),
        getStreakRecords()
      ]);
      
      setData({
        habits: habitsData || [],
        completions: completionsData || [],
        failures: failuresData || [],
        streakRecords: streakRecordsData || [],
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching trend data:", error);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to load habit trend data" 
      }));
      
      toast({
        title: "Error",
        description: "Failed to load habit trend data",
        variant: "destructive"
      });
    }
  }, [timeFilter]);

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
