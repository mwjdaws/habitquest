
import { HabitFailure } from "@/lib/habitTypes";
import { useMemo } from "react";

/**
 * Custom hook to extract and memoize failure info from failures array
 * Optimized with Map for O(1) lookups instead of array iteration
 */
export function useFailureInfo(
  habitId: string,
  isFailed: boolean,
  failures: HabitFailure[]
): string {
  return useMemo(() => {
    if (!isFailed || !failures || failures.length === 0) return '';
    
    // Create a Map for O(1) lookup performance instead of using find() which is O(n)
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    const failure = failureMap.get(habitId);
    
    return failure?.reason || "Failed";
  }, [isFailed, failures, habitId]);
}
