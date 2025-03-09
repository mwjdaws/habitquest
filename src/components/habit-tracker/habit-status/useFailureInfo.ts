
import { HabitFailure } from "@/lib/habitTypes";
import { useMemo } from "react";

/**
 * Custom hook to extract and memoize failure info from failures array
 * Optimized with Map for O(1) lookups instead of array iteration
 */
export function useFailureInfo(
  habitId: string,
  isFailed: boolean,
  failures: HabitFailure[] | null | undefined
): string {
  return useMemo(() => {
    // Guard against invalid inputs
    if (!habitId || !isFailed || !failures || failures.length === 0) {
      return '';
    }
    
    try {
      // Create a Map for O(1) lookup performance instead of using find() which is O(n)
      const failureMap = new Map(failures.map(f => [f.habit_id, f]));
      const failure = failureMap.get(habitId);
      
      // If failure exists, use its reason, otherwise use a generic message
      return failure?.reason || "Failed";
    } catch (error) {
      console.error("Error processing failure info:", error);
      return "Failed";
    }
  }, [isFailed, failures, habitId]);
}
