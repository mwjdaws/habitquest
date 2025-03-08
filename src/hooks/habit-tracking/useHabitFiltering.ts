
import { useCallback } from "react";
import { Habit } from "@/lib/habitTypes";
import { getDayName, shouldShowHabitForDay } from "@/lib/habitUtils";

/**
 * Hook to handle habit filtering logic
 */
export function useHabitFiltering() {
  // Create a dedicated function to filter habits for today
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    if (!allHabits || !allHabits.length) return [];
    
    const todayName = getDayName(new Date());
    return allHabits.filter(habit => {
      // Empty frequency array means the habit should show every day
      return habit.frequency.length === 0 || habit.frequency.includes(todayName.toLowerCase());
    });
  }, []);

  return {
    filterHabitsForToday
  };
}
