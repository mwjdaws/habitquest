
import { useMemo } from "react";
import { Habit, HabitCompletion } from "@/lib/habitTypes";
import { getTodayFormatted } from "@/lib/habitUtils";

/**
 * Hook to calculate metrics for habit tracking display
 * 
 * @param {Habit[]} habits - Array of habits to calculate metrics for
 * @param {HabitCompletion[]} completions - Array of completions to check against
 * @returns {Object} Metrics including progress, completed count, and total count
 */
export function useHabitMetrics(
  habits: Habit[], 
  completions: HabitCompletion[],
  selectedDate: string = getTodayFormatted()
) {
  return useMemo(() => {
    // Calculate metrics only if there are habits
    if (!habits.length) {
      return {
        progress: 0,
        completedCount: 0,
        totalCount: 0
      };
    }
    
    // Filter completions by the selected date
    const dateCompletions = completions.filter(c => c.completed_date === selectedDate);
    
    // Count completed habits for the selected date
    const completedCount = habits.reduce((count, habit) => {
      const isCompleted = dateCompletions.some(c => c.habit_id === habit.id);
      return isCompleted ? count + 1 : count;
    }, 0);
    
    // Calculate progress percentage (avoid division by zero)
    const totalCount = habits.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      progress,
      completedCount,
      totalCount
    };
  }, [habits, completions, selectedDate]);
}
