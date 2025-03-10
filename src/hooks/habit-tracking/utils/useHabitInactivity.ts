
import { useMemo } from "react";
import { Habit, HabitCompletion, HABIT_LOSS_DAYS } from "@/lib/habitTypes";
import { getTodayFormattedInToronto } from "@/lib/dateUtils";

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
 * based on days of inactivity
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
      const daysSinceCreation = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If habit was created within the last 2 days, don't show warning yet
      if (daysSinceCreation < 2) {
        return { isInactive: false, isInconsistent: false, isLost: false, daysInactive: 0 };
      }
      
      // Otherwise treat as inactive since creation
      return {
        isInactive: true,
        isInconsistent: daysSinceCreation >= HABIT_INCONSISTENT_MIN_DAYS && 
                        daysSinceCreation <= HABIT_INCONSISTENT_MAX_DAYS,
        isLost: daysSinceCreation >= HABIT_LOSS_DAYS,
        daysInactive: daysSinceCreation
      };
    }
    
    // Find the most recent completion
    const sortedCompletions = [...habitCompletions].sort((a, b) => 
      new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
    );
    
    const lastCompletionDate = new Date(sortedCompletions[0].completed_date);
    const today = new Date(getTodayFormattedInToronto());
    
    // Calculate days since last completion
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      isInactive: daysSinceLastCompletion > 0,
      isInconsistent: daysSinceLastCompletion >= HABIT_INCONSISTENT_MIN_DAYS && 
                      daysSinceLastCompletion <= HABIT_INCONSISTENT_MAX_DAYS,
      isLost: daysSinceLastCompletion >= HABIT_LOSS_DAYS,
      daysInactive: daysSinceLastCompletion
    };
  }, [habit, completions]);
}
