
import { useState, useCallback, useMemo } from "react";

export type TimeFilter = "week" | "month" | "all";

/**
 * Helper function to determine days from time filter
 */
export const getDaysFromFilter = (filter: TimeFilter): number => {
  switch (filter) {
    case "week": return 7;
    case "month": return 30;
    case "all": return 365;
    default: return 7;
  }
};

/**
 * Hook for managing time filters with consistent behavior
 */
export function useTimeFilter(initialFilter: TimeFilter = "week") {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(initialFilter);
  
  // Directly memoize the days value to avoid recalculation
  const days = useMemo(() => getDaysFromFilter(timeFilter), [timeFilter]);
  
  // Simplified getter that returns the memoized value directly
  const getDays = useCallback(() => days, [days]);
  
  // Optimized setter that avoids unnecessary state updates
  const setValidatedTimeFilter = useCallback((newFilter: TimeFilter | string) => {
    if (newFilter === timeFilter) return; // Skip update if value hasn't changed
    
    if (newFilter === "week" || newFilter === "month" || newFilter === "all") {
      setTimeFilter(newFilter);
    } else {
      console.warn(`Invalid time filter: ${newFilter}, using default (week)`);
      setTimeFilter("week");
    }
  }, [timeFilter]);
  
  return {
    timeFilter,
    setTimeFilter: setValidatedTimeFilter,
    days,
    getDays
  };
}
