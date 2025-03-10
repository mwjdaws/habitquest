
import { useMemo } from "react";
import { Habit, HabitCompletion } from "@/lib/habitTypes";

/**
 * Hook for calculating habit metrics with proper memoization
 */
export function useHabitMetrics(
  habits: Habit[],
  completions: HabitCompletion[]
) {
  return useMemo(() => {
    const totalCount = habits.length;
    const completedCount = habits.filter(habit => 
      completions.some(c => c.habit_id === habit.id)
    ).length;
    
    const progress = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;
    
    return { totalCount, completedCount, progress };
  }, [habits, completions]);
}
