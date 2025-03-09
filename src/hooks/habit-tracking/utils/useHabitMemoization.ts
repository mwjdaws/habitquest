
import { useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

/**
 * Hook that returns memoized status values for a habit with optimized calculations
 */
export function useHabitStatus(
  habit: Habit,
  completions: HabitCompletion[],
  failures: HabitFailure[]
) {
  return useMemo(() => {
    // Use Set for O(1) lookups instead of array iteration
    const completionIds = new Set(completions.map(c => c.habit_id));
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    
    const isCompleted = completionIds.has(habit.id);
    const isFailed = failureMap.has(habit.id);
    const failureReason = isFailed ? failureMap.get(habit.id)?.reason || "" : "";
    
    const bgColorClass = isCompleted 
      ? "bg-green-50 border-green-200" 
      : isFailed 
        ? "bg-red-50 border-red-200" 
        : "bg-background";
    
    return { 
      isCompleted, 
      isFailed, 
      failureReason,
      bgColorClass
    };
  }, [habit.id, completions, failures]);
}

/**
 * Optimized function to determine if HabitItem needs to re-render
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Fast identity checks
  if (prevProps.habit.id !== nextProps.habit.id) return false;
  
  // Use Set for O(1) lookups of completions
  const prevCompletionIds = new Set(prevProps.completions.map((c: any) => c.habit_id));
  const nextCompletionIds = new Set(nextProps.completions.map((c: any) => c.habit_id));
  
  const prevCompleted = prevCompletionIds.has(prevProps.habit.id);
  const nextCompleted = nextCompletionIds.has(nextProps.habit.id);
  
  if (prevCompleted !== nextCompleted) return false;
  
  // Use Map for O(1) lookups of failures
  const prevFailureMap = new Map(prevProps.failures.map((f: any) => [f.habit_id, f]));
  const nextFailureMap = new Map(nextProps.failures.map((f: any) => [f.habit_id, f]));
  
  const prevFailure = prevFailureMap.get(prevProps.habit.id);
  const nextFailure = nextFailureMap.get(nextProps.habit.id);
  
  if (!prevFailure && !nextFailure) return true;
  if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) return false;
  
  return prevFailure && nextFailure 
    ? (prevFailure as HabitFailure).reason === (nextFailure as HabitFailure).reason 
    : true;
}
