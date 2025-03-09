
import { HabitFailure } from "@/lib/habitTypes";
import { useMemo } from "react";

/**
 * Custom hook to extract and memoize failure info from failures array
 */
export function useFailureInfo(
  habitId: string,
  isFailed: boolean,
  failures: HabitFailure[]
): string {
  return useMemo(() => {
    if (!isFailed) return '';
    // Find only runs when needed
    const failure = failures.find(f => f.habit_id === habitId);
    return failure ? failure.reason || "Failed" : "Failed";
  }, [isFailed, failures, habitId]);
}
