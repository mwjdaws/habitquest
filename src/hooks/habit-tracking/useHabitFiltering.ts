
import { useCallback, useMemo } from "react";
import { Habit } from "@/lib/habitTypes";
import { getDayName } from "@/lib/habitUtils";

/**
 * Hook to handle habit filtering logic with improved performance
 */
export function useHabitFiltering() {
  // Get today's name once - memoized to prevent recalculation
  const todayName = useMemo(() => getDayName(new Date()).toLowerCase(), []);
  
  // Create a more efficient filtering function with better optimization
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    // Early return for empty arrays to avoid unnecessary processing
    if (!allHabits || allHabits.length === 0) {
      return [];
    }
    
    // Use direct array filtering without intermediate variables
    return allHabits.filter(habit => 
      habit.frequency.length === 0 || habit.frequency.includes(todayName)
    );
  }, [todayName]);

  // Return a stable reference to the filter function
  return { filterHabitsForToday };
}
