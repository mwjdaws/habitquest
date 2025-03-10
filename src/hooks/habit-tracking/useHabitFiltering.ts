
import { useCallback, useMemo } from "react";
import { Habit } from "@/lib/habitTypes";
import { getTodayName, isHabitForToday } from "./utils/commonUtils";

/**
 * Hook to handle habit filtering logic with improved performance
 */
export function useHabitFiltering() {
  // Get today's name once - memoized to prevent recalculation
  const todayName = useMemo(() => getTodayName(), []);
  
  // Create a more efficient filtering function with optimizations
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    // Early return for empty arrays to avoid unnecessary processing
    if (!allHabits || allHabits.length === 0) {
      return [];
    }
    
    // Pre-allocate array size if possible for better memory performance
    const estimatedFilteredSize = Math.ceil(allHabits.length * 0.7); // Assuming ~70% match
    const result = [];
    result.length = estimatedFilteredSize; // Pre-allocate for performance
    
    let resultIndex = 0;
    
    // Manual loop is faster than filter for large arrays
    for (let i = 0; i < allHabits.length; i++) {
      const habit = allHabits[i];
      if (isHabitForToday(habit, todayName)) {
        if (resultIndex < estimatedFilteredSize) {
          result[resultIndex] = habit;
        } else {
          result.push(habit);
        }
        resultIndex++;
      }
    }
    
    // Trim array to actual size if pre-allocation was used
    if (resultIndex < estimatedFilteredSize) {
      result.length = resultIndex;
    }
    
    return result;
  }, [todayName]);

  // Return a stable reference to the filter function
  return { filterHabitsForToday };
}
