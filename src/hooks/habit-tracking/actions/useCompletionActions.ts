
import { useCallback } from "react";
import { toggleHabitCompletion, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useActionHandler } from "../utils/useActionHandler";
import { useStreakCalculation } from "../utils/useStreakCalculation";
import { isPastDate } from "../utils/commonUtils";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for managing habit completion actions
 */
export function useCompletionActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean, forceRefresh?: boolean) => void,
  findHabit: (habitId: string) => Habit | undefined,
  pendingActionsRef: React.MutableRefObject<Set<string>>,
  selectedDate: string = getTodayFormatted()
) {
  const { user } = useAuth();
  const { handleAction } = useActionHandler();
  const { calculateHabitStreak } = useStreakCalculation();

  // Handle toggling habit completion with optimistic updates and request deduplication
  const handleToggleCompletion = useCallback(async (habitId: string) => {
    if (!user) return;
    
    const actionKey = `toggle-${habitId}-${selectedDate}`;
    const isCompleted = state.completions.some(c => c.habit_id === habitId && c.completed_date === selectedDate);
    const habit = findHabit(habitId);
    const isPast = isPastDate(selectedDate);
    
    // Prevent toggling off completions for past dates
    if (isPast && isCompleted) {
      toast({
        title: "Cannot modify past completions",
        description: "Past habit completions cannot be changed.",
        variant: "destructive"
      });
      return;
    }
    
    if (!habit) {
      console.error('Could not find habit with ID:', habitId);
      return;
    }
    
    // Optimistic update with immutable state management
    setState(prev => {
      // Handle completion removal
      if (isCompleted) {
        // Create updated completions list without this habit for this date
        const newCompletions = prev.completions.filter(c => 
          !(c.habit_id === habitId && c.completed_date === selectedDate)
        );
        
        // Only recalculate streak for current day
        let updatedHabits = prev.habits;
        let updatedFiltered = prev.filteredHabits;
        
        if (selectedDate === getTodayFormatted()) {
          // Calculate new streak for optimistic UI update using frequency-aware calculation
          const newStreak = calculateHabitStreak(habit, newCompletions, prev.failures);
          
          // Update habits and filtered habits with new streak
          updatedHabits = prev.habits.map(h => 
            h.id === habitId ? { ...h, current_streak: newStreak } : h
          );
          
          updatedFiltered = prev.filteredHabits.map(h => 
            h.id === habitId ? { ...h, current_streak: newStreak } : h
          );
        }
        
        return {
          ...prev,
          habits: updatedHabits,
          filteredHabits: updatedFiltered,
          completions: newCompletions
        };
      } 
      // Handle completion addition
      else {
        const newCompletion = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: selectedDate,
          created_at: new Date().toISOString()
        };
        
        // Create updated completions list with new completion
        const newCompletions = [...prev.completions, newCompletion];
        
        // Only update streak for current day
        let updatedHabits = prev.habits;
        let updatedFiltered = prev.filteredHabits;
        
        if (selectedDate === getTodayFormatted()) {
          // Calculate new streak for optimistic UI update using frequency-aware calculation
          const newStreak = calculateHabitStreak(habit, newCompletions, 
            prev.failures.filter(f => f.habit_id !== habitId || f.failure_date !== selectedDate));
          
          const newLongestStreak = Math.max(newStreak, habit.longest_streak || 0);
          
          // Update habits and filtered habits with new streak
          updatedHabits = prev.habits.map(h => 
            h.id === habitId ? { 
              ...h, 
              current_streak: newStreak,
              longest_streak: newLongestStreak
            } : h
          );
          
          updatedFiltered = prev.filteredHabits.map(h => 
            h.id === habitId ? { 
              ...h, 
              current_streak: newStreak,
              longest_streak: newLongestStreak
            } : h
          );
        }
        
        return {
          ...prev,
          habits: updatedHabits,
          filteredHabits: updatedFiltered,
          completions: newCompletions,
          // Remove any failure for this habit when marking as completed
          failures: prev.failures.filter(f => 
            !(f.habit_id === habitId && f.failure_date === selectedDate)
          )
        };
      }
    });
    
    await handleAction(
      "Toggle completion",
      actionKey,
      pendingActionsRef,
      () => toggleHabitCompletion(habitId, selectedDate, isCompleted),
      () => {},
      undefined,
      () => refreshData(false),
      {
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!"
      }
    );
  }, [user, state.completions, state.failures, state.habits, selectedDate, setState, findHabit, handleAction, pendingActionsRef, refreshData, calculateHabitStreak]);

  return {
    handleToggleCompletion
  };
}
