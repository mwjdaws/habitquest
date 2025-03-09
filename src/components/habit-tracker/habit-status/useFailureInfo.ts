
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
    if (!isFailed) return '';
    
    // Create a Map for O(1) lookup performance instead of using find() which is O(n)
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    const failure = failureMap.get(habitId);
    
    return failure ? failure.reason || "Failed" : "Failed";
  }, [isFailed, failures, habitId]);
}
