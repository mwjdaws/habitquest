
import { useMemo } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { getTodayFormatted } from "@/lib/habits";

/**
 * Returns status information for a habit based on completions and failures
 * 
 * @param {Habit} habit - The habit to get status for
 * @param {HabitCompletion[]} completions - Array of habit completions
 * @param {HabitFailure[]} failures - Array of habit failures
 * @param {string} selectedDate - The date to check status for
 * @returns Habit status information including completion, failure status and styling
 */
export function useHabitStatus(
  habit: Habit, 
  completions: HabitCompletion[], 
  failures: HabitFailure[],
  selectedDate: string = getTodayFormatted()
) {
  return useMemo(() => {
    // Check if habit is completed for the selected date
    const isCompleted = completions.some(
      completion => 
        completion.habit_id === habit.id && 
        completion.completed_date === selectedDate
    );
    
    // Check if habit is failed for the selected date
    const isFailed = failures.some(
      failure => 
        failure.habit_id === habit.id && 
        failure.failure_date === selectedDate
    );
    
    // Get background color class based on status
    let bgColorClass = '';
    if (isCompleted) {
      bgColorClass = 'bg-green-50';
    } else if (isFailed) {
      bgColorClass = 'bg-red-50';
    }
    
    // Get failure reason if available
    const failureReason = isFailed
      ? failures.find(
          f => f.habit_id === habit.id && f.failure_date === selectedDate
        )?.reason || ''
      : '';
    
    return {
      isCompleted,
      isFailed,
      bgColorClass,
      failureReason
    };
  }, [habit.id, completions, failures, selectedDate]);
}

/**
 * Custom props equality comparison function for HabitItem component memoization
 * to prevent unnecessary re-renders
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Compare habit IDs
  if (prevProps.habit.id !== nextProps.habit.id) return false;
  
  // Compare selectedDate
  if (prevProps.selectedDate !== nextProps.selectedDate) return false;
  
  // Extract habit IDs for faster completion checks
  const habitId = prevProps.habit.id;
  
  // Only compare completions for this specific habit 
  // Check if completion status changed for this habit on the selected date
  const prevComplete = prevProps.completions.some(
    (c: HabitCompletion) => c.habit_id === habitId && c.completed_date === prevProps.selectedDate
  );
  const nextComplete = nextProps.completions.some(
    (c: HabitCompletion) => c.habit_id === habitId && c.completed_date === nextProps.selectedDate
  );
  if (prevComplete !== nextComplete) return false;
  
  // Check if failure status changed for this habit on the selected date
  const prevFailed = prevProps.failures.some(
    (f: HabitFailure) => f.habit_id === habitId && f.failure_date === prevProps.selectedDate
  );
  const nextFailed = nextProps.failures.some(
    (f: HabitFailure) => f.habit_id === habitId && f.failure_date === nextProps.selectedDate
  );
  if (prevFailed !== nextFailed) return false;
  
  // If we get here, all relevant props are equal
  return true;
}
