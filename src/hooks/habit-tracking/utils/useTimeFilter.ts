
import { useState, useCallback } from "react";

export type TimeFilter = "week" | "month" | "all";

/**
 * Helper function to determine days from time filter
 */
export const getDaysFromFilter = (filter: TimeFilter): number => {
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

/**
 * Hook for managing time filters with consistent behavior
 */
export function useTimeFilter(initialFilter: TimeFilter = "week") {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(initialFilter);
  
  const getDays = useCallback(() => {
    return getDaysFromFilter(timeFilter);
  }, [timeFilter]);
  
  return {
    timeFilter,
    setTimeFilter,
    getDays
  };
}
