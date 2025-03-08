
import { useCallback, useMemo } from "react";
import { Habit } from "@/lib/habitTypes";
import { getDayName } from "@/lib/habitUtils";

/**
 * Hook to handle habit filtering logic with improved performance
 */
export function useHabitFiltering() {
  // Create a dedicated function to filter habits for today with memoization
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

  // Add memoization wrapper for the filter function to prevent unnecessary recalculations
  const memoizedFilterHabitsForToday = useCallback((habits: Habit[]) => {
    // Create a cache key based on habits array and current date
    const cacheKey = `${habits.length}:${habits.map(h => h.id).join(',')}:${new Date().toDateString()}`;
    
    // Use the memo cache to store and retrieve filtered results
    return useMemo(() => {
      console.log("Computing filtered habits (memoized)");
      return filterHabitsForToday(habits);
    }, [habits, cacheKey, filterHabitsForToday]);
  }, [filterHabitsForToday]);

  return {
    filterHabitsForToday: memoizedFilterHabitsForToday
  };
}
