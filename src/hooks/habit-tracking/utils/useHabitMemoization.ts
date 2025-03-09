
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
    // Create Set objects for O(1) lookups instead of array iteration
    const completionIds = new Set(completions.map(c => c.habit_id));
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    
    // Use Set/Map for constant-time lookups
    const isCompleted = completionIds.has(habit.id);
    const isFailed = failureMap.has(habit.id);
    
    // Only find failure reason if habit is failed - direct map lookup
    const failureReason = isFailed ? failureMap.get(habit.id)?.reason || "" : "";
    
    // Determine background color based on status - direct string assignment
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
 * with improved short-circuit logic
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Fast identity check for habit object itself
  if (prevProps.habit === nextProps.habit) {
    // Fast identity checks for completions and failures arrays
    if (prevProps.completions === nextProps.completions && 
        prevProps.failures === nextProps.failures) {
      return true;
    }
    
    // Habits are identical, now just check completion and failure status
    const prevCompleted = new Set(prevProps.completions.map((c: any) => c.habit_id)).has(prevProps.habit.id);
    const nextCompleted = new Set(nextProps.completions.map((c: any) => c.habit_id)).has(nextProps.habit.id);
    
    if (prevCompleted !== nextCompleted) return false;
    
    // More efficient lookup with Map
    const prevFailureMap = new Map(prevProps.failures.map((f: any) => [f.habit_id, f]));
    const nextFailureMap = new Map(nextProps.failures.map((f: any) => [f.habit_id, f]));
    
    const prevFailure = prevFailureMap.get(prevProps.habit.id);
    const nextFailure = nextFailureMap.get(nextProps.habit.id);
    
    // Short-circuit for both undefined/null
    if (!prevFailure && !nextFailure) return true;
    
    // Short-circuit if one exists and other doesn't
    if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) return false;
    
    // Only compare reasons if both exist
    return prevFailure?.reason === nextFailure?.reason;
  }
  
  // Check identity of core habit properties that affect rendering
  if (prevProps.habit.id !== nextProps.habit.id ||
      prevProps.habit.name !== nextProps.habit.name ||
      prevProps.habit.color !== nextProps.habit.color ||
      prevProps.habit.description !== nextProps.habit.description ||
      prevProps.habit.category !== nextProps.habit.category ||
      prevProps.habit.current_streak !== nextProps.habit.current_streak) {
    return false;
  }
  
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
  if (prevFailure && nextFailure) return prevFailure.reason === nextFailure.reason;
  
  return true;
}
