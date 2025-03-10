
import { useMemo } from "react";
import { Habit, HabitCompletion, HABIT_LOSS_DAYS } from "@/lib/habitTypes";
import { getTodayFormattedInToronto } from "@/lib/dateUtils";
import { isRequiredHabitDay } from "./useStreakCalculation";

// Constants for inactive states
export const HABIT_INCONSISTENT_MIN_DAYS = 3;
export const HABIT_INCONSISTENT_MAX_DAYS = 6;

type InactivityStatus = {
  isInactive: boolean;
  isInconsistent: boolean;
  isLost: boolean;
  daysInactive: number;
};

/**
 * Hook to determine if a habit is becoming inconsistent or lost
 * based on days of inactivity, accounting for custom frequencies
 */
export function useHabitInactivity(
  habit: Habit,
  completions: HabitCompletion[]
): InactivityStatus {
  return useMemo(() => {
    const habitCompletions = completions.filter(c => c.habit_id === habit.id);
    
    if (habitCompletions.length === 0) {
      // If habit has never been completed, check creation date
      const creationDate = new Date(habit.created_at);
      const today = new Date();
      
      // Count only required days since creation
      let requiredDaysSinceCreation = 0;
      const tempDate = new Date(creationDate);
      
      while (tempDate <= today) {
        const dateStr = tempDate.toISOString().split('T')[0];
        if (isRequiredHabitDay(habit, dateStr)) {
          requiredDaysSinceCreation++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
      
      // If habit was created within the last 2 required days, don't show warning yet
      if (requiredDaysSinceCreation < 2) {
        return { isInactive: false, isInconsistent: false, isLost: false, daysInactive: 0 };
      }
      
      // Otherwise treat as inactive since creation
      return {
        isInactive: true,
        isInconsistent: requiredDaysSinceCreation >= HABIT_INCONSISTENT_MIN_DAYS && 
                        requiredDaysSinceCreation <= HABIT_INCONSISTENT_MAX_DAYS,
        isLost: requiredDaysSinceCreation >= HABIT_LOSS_DAYS,
        daysInactive: requiredDaysSinceCreation
      };
    }
    
    // Find the most recent completion
    const sortedCompletions = [...habitCompletions].sort((a, b) => 
      new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
    );
    
    const lastCompletionDate = new Date(sortedCompletions[0].completed_date);
    const today = new Date(getTodayFormattedInToronto());
    
    // Count only required days since last completion
    let requiredDaysSinceLastCompletion = 0;
    const tempDate = new Date(lastCompletionDate);
    tempDate.setDate(tempDate.getDate() + 1); // Start from day after last completion
    
    while (tempDate <= today) {
      const dateStr = tempDate.toISOString().split('T')[0];
      if (isRequiredHabitDay(habit, dateStr)) {
        requiredDaysSinceLastCompletion++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return {
      isInactive: requiredDaysSinceLastCompletion > 0,
      isInconsistent: requiredDaysSinceLastCompletion >= HABIT_INCONSISTENT_MIN_DAYS && 
                    requiredDaysSinceLastCompletion <= HABIT_INCONSISTENT_MAX_DAYS,
      isLost: requiredDaysSinceLastCompletion >= HABIT_LOSS_DAYS,
      daysInactive: requiredDaysSinceLastCompletion
    };
  }, [habit, completions]);
}
