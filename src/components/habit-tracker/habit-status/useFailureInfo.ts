
import { HabitFailure } from "@/lib/habitTypes";
import { useMemo } from "react";

/**
 * Custom hook to extract and memoize failure information from a failures array
 * 
 * This hook efficiently finds a failure reason for a specific habit using a Map
 * for O(1) lookup performance instead of array iteration which would be O(n).
 *
 * @param {string} habitId - ID of the habit to find failure info for
 * @param {boolean} isFailed - Whether the habit is currently marked as failed
 * @param {HabitFailure[] | null | undefined} failures - Array of failure records 
 * @returns {string} The failure reason if found, or empty string if not failed or no reason
 * 
 * @example
 * const failureReason = useFailureInfo(habit.id, isHabitFailed, failures);
 * // Use failureReason in UI: {failureReason && <FailedStatus reason={failureReason} />}
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
    
    // Create a Map for O(1) lookup performance instead of using find() which is O(n)
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    const failure = failureMap.get(habitId);
    
    // If failure exists, use its reason, otherwise use a generic message
    return failure?.reason || "Failed";
  }, [isFailed, failures, habitId]);
}
