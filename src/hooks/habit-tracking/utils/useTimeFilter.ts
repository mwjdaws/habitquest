
import { useState, useCallback, useMemo } from "react";

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
  
  // Memoize the days calculation to prevent unnecessary calculations
  const days = useMemo(() => getDaysFromFilter(timeFilter), [timeFilter]);
  
  // Create a memoized getter function for compatibility with existing code
  const getDays = useCallback(() => days, [days]);
  
  // Create a safe setter that validates the input
  const setValidatedTimeFilter = useCallback((newFilter: TimeFilter | string) => {
    // Validate that the filter is a valid TimeFilter
    if (newFilter === "week" || newFilter === "month" || newFilter === "all") {
      setTimeFilter(newFilter);
    } else {
      console.warn(`Invalid time filter: ${newFilter}, using default (week)`);
      setTimeFilter("week");
    }
  }, []);
  
  return {
    timeFilter,
    setTimeFilter: setValidatedTimeFilter,
    days,
    getDays
  };
}
