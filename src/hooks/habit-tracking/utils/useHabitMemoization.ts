
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
    const isCompleted = completions.some(c => c.habit_id === habit.id);
    const isFailed = failures.some(f => f.habit_id === habit.id);
    const failureReason = isFailed 
      ? failures.find(f => f.habit_id === habit.id)?.reason || "" 
      : "";
    
    // Determine background color based on status
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
 * Function to determine if HabitItem needs to re-render
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Check identity of core habit properties that affect rendering
  if (prevProps.habit.id !== nextProps.habit.id ||
      prevProps.habit.name !== nextProps.habit.name ||
      prevProps.habit.color !== nextProps.habit.color ||
      prevProps.habit.description !== nextProps.habit.description ||
      prevProps.habit.category !== nextProps.habit.category ||
      prevProps.habit.current_streak !== nextProps.habit.current_streak) {
    return false; // Render if any of these changed
  }
  
  // Check completion status
  const prevCompleted = prevProps.completions.some(c => c.habit_id === prevProps.habit.id);
  const nextCompleted = nextProps.completions.some(c => c.habit_id === nextProps.habit.id);
  if (prevCompleted !== nextCompleted) {
    return false; // Render if completion status changed
  }
  
  // Check failure status and reason
  const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habit.id);
  const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habit.id);
  
  // If both are undefined or null, they're equal
  if (!prevFailure && !nextFailure) {
    return true;
  }
  
  // If one is defined and the other isn't, they're not equal
  if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) {
    return false;
  }
  
  // If both are defined, compare their reasons
  if (prevFailure && nextFailure) {
    return prevFailure.reason === nextFailure.reason;
  }
  
  // Default to re-rendering if we can't determine equality
  return false;
}
