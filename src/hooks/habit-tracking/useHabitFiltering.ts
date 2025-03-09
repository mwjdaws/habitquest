
import { useCallback, useMemo } from "react";
import { Habit } from "@/lib/habitTypes";
import { getDayName } from "@/lib/habitUtils";

/**
 * Hook to handle habit filtering logic with improved performance
 */
export function useHabitFiltering() {
  // Get today's name once
  const todayName = useMemo(() => getDayName(new Date()).toLowerCase(), []);
  
  // Create a dedicated function to filter habits for today with memoization
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    if (!allHabits?.length) {
      return [];
    }
    
    console.log(`Filtering for ${todayName}:`, allHabits.length, "total habits");
    
    return allHabits.filter(habit => {
      // Empty frequency array means the habit should show every day
      return habit.frequency.length === 0 || 
             habit.frequency.includes(todayName);
    });
  }, [todayName]);

  // Return a stable reference to the filter function
  return useMemo(() => ({
    filterHabitsForToday
  }), [filterHabitsForToday]);
}
