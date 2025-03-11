
import { useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from '@/lib/habitTypes';
import { shouldShowHabitForDay, getDayName } from '@/lib/habitUtils';

/**
 * Hook for calculating habit statistics
 */
export function useHabitStats(
  habits: Habit[],
  completions: HabitCompletion[],
  failures: HabitFailure[],
  selectedDate: string
) {
  return useMemo(() => {
    // Get day name for the selected date (e.g., "monday")
    const dayName = getDayName(new Date(selectedDate));
    
    // Filter habits that should be shown for this day based on frequency
    const applicableHabits = habits.filter(habit => 
      shouldShowHabitForDay(habit, dayName)
    );
    
    // Count total applicable habits
    const totalCount = applicableHabits.length;
    
    // Count completed habits
    const completedCount = applicableHabits.filter(habit => 
      completions.some(c => c.habit_id === habit.id)
    ).length;
    
    // Calculate progress percentage
    const progress = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;
    
    return {
      progress,
      completedCount,
      totalCount
    };
  }, [habits, completions, failures, selectedDate]);
}
