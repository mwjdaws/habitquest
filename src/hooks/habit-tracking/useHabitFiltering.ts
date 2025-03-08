
import { useCallback } from "react";
import { Habit } from "@/lib/habitTypes";
import { getDayName } from "@/lib/habitUtils";

/**
 * Hook to handle habit filtering logic with improved logging
 */
export function useHabitFiltering() {
  // Create a dedicated function to filter habits for today
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    if (!allHabits || !allHabits.length) {
      console.log("No habits to filter");
      return [];
    }
    
    const todayName = getDayName(new Date());
    console.log(`Filtering for ${todayName}:`, allHabits.length, "total habits");
    
    const filteredHabits = allHabits.filter(habit => {
      // Empty frequency array means the habit should show every day
      const shouldShow = habit.frequency.length === 0 || 
                         habit.frequency.includes(todayName.toLowerCase());
      
      if (shouldShow) {
        console.log(`Including habit: ${habit.name} [${habit.frequency.join(', ') || 'daily'}]`);
      }
      
      return shouldShow;
    });
    
    console.log(`Filtered to ${filteredHabits.length} habits for today`);
    return filteredHabits;
  }, []);

  return {
    filterHabitsForToday
  };
}
