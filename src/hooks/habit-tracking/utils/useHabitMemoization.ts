
import { useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

/**
 * Hook that returns memoized status values for a habit
 */
export function useHabitStatus(
  habit: Habit,
  completions: HabitCompletion[],
  failures: HabitFailure[]
) {
  return useMemo(() => {
    // Use map lookup instead of array iteration for faster checks
    const isCompleted = completions.some(c => c.habit_id === habit.id);
    const isFailed = failures.some(f => f.habit_id === habit.id);
    
    // Only find failure reason if habit is failed
    const failureReason = isFailed 
      ? failures.find(f => f.habit_id === habit.id)?.reason || "" 
      : "";
    
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
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Fast identity check for habit object itself
  if (prevProps.habit === nextProps.habit) {
    // Habits are identical, now just check completions and failures
    const prevCompleted = prevProps.completions.some(c => c.habit_id === prevProps.habit.id);
    const nextCompleted = nextProps.completions.some(c => c.habit_id === nextProps.habit.id);
    
    if (prevCompleted !== nextCompleted) return false;
    
    const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habit.id);
    const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habit.id);
    
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
  
  // Check completion status
  const prevCompleted = prevProps.completions.some(c => c.habit_id === prevProps.habit.id);
  const nextCompleted = nextProps.completions.some(c => c.habit_id === nextProps.habit.id);
  if (prevCompleted !== nextCompleted) return false;
  
  // Check failure status
  const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habit.id);
  const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habit.id);
  
  if (!prevFailure && !nextFailure) return true;
  if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) return false;
  if (prevFailure && nextFailure) return prevFailure.reason === nextFailure.reason;
  
  return true;
}
