
import { useMemo } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { shouldShowHabitForDay } from "@/lib/habitUtils";
import { formatTorontoDate, getTodayFormattedInToronto } from "@/lib/dateUtils";

/**
 * Calculates whether a specific date was a required day for a habit
 * based on its frequency settings
 */
export function isRequiredHabitDay(habit: Habit, dateString: string): boolean {
  const date = new Date(dateString);
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date).toLowerCase();
  
  return shouldShowHabitForDay(habit, dayName);
}

/**
 * Hook to calculate the streak for a habit based on its custom frequency
 */
export function useStreakCalculation() {
  
  /**
   * Calculate the correct streak for a habit considering its frequency pattern
   */
  const calculateHabitStreak = useMemo(() => (
    habit: Habit, 
    completions: HabitCompletion[],
    failures: HabitFailure[]
  ): number => {
    // No streak if habit has been failed
    const hasFailed = failures.some(f => f.habit_id === habit.id);
    if (hasFailed) {
      return 0;
    }
    
    // Get completions for this habit, sorted by date (newest first)
    const habitCompletions = completions
      .filter(c => c.habit_id === habit.id)
      .sort((a, b) => new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime());
    
    // If no completions, return 0
    if (habitCompletions.length === 0) {
      return 0;
    }
    
    const today = getTodayFormattedInToronto();
    let currentDate = new Date(today);
    
    // Check if completed today
    const completedToday = habitCompletions.some(c => c.completed_date === today);
    
    // If not completed today and today is a required day, streak is broken
    if (!completedToday && isRequiredHabitDay(habit, today)) {
      return 0;
    }
    
    let streak = completedToday ? 1 : 0;
    let daysChecked = completedToday ? 1 : 0;
    
    // Go back in time to check previous days
    while (daysChecked < 60) { // Limit check to last 60 days
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      const dateStr = formatTorontoDate(currentDate);
      
      // Check if this day was a required day for the habit
      const isRequired = isRequiredHabitDay(habit, dateStr);
      
      // If not a required day, continue to previous day without affecting streak
      if (!isRequired) {
        continue;
      }
      
      // This is a required day, check if it was completed
      const isCompleted = habitCompletions.some(c => c.completed_date === dateStr);
      
      // If a required day was missed, streak is broken
      if (!isCompleted) {
        break;
      }
      
      // Increment streak for completed required days
      streak++;
      daysChecked++;
    }
    
    return streak;
  }, []);
  
  return { calculateHabitStreak };
}
