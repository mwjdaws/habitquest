
import { useCallback } from "react";
import { toggleHabitCompletion, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useActionHandler } from "../utils/useActionHandler";
import { useStreakCalculation } from "../utils/useStreakCalculation";

/**
 * Hook for managing habit completion actions
 */
export function useCompletionActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean, forceRefresh?: boolean) => void,
  findHabit: (habitId: string) => Habit | undefined,
  pendingActionsRef: React.MutableRefObject<Set<string>>
) {
  const { user } = useAuth();
  const today = getTodayFormatted();
  const { handleAction } = useActionHandler();
  const { calculateHabitStreak } = useStreakCalculation();

  // Handle toggling habit completion with optimistic updates and request deduplication
  const handleToggleCompletion = useCallback(async (habitId: string) => {
    if (!user) return;
    
    const actionKey = `toggle-${habitId}`;
    const isCompleted = state.completions.some(c => c.habit_id === habitId);
    const habit = findHabit(habitId);
    
    if (!habit) {
      console.error('Could not find habit with ID:', habitId);
      return;
    }
    
    // Optimistic update with immutable state management
    setState(prev => {
      // Handle completion removal
      if (isCompleted) {
        // Create updated completions list without this habit
        const newCompletions = prev.completions.filter(c => c.habit_id !== habitId);
        
        // Calculate new streak for optimistic UI update using frequency-aware calculation
        const newStreak = calculateHabitStreak(habit, newCompletions, prev.failures);
        
        // Update habits and filtered habits with new streak
        const updatedHabits = prev.habits.map(h => 
          h.id === habitId ? { ...h, current_streak: newStreak } : h
        );
        
        const updatedFiltered = prev.filteredHabits.map(h => 
          h.id === habitId ? { ...h, current_streak: newStreak } : h
        );
        
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
          completed_date: today,
          created_at: new Date().toISOString()
        };
        
        // Create updated completions list with new completion
        const newCompletions = [...prev.completions, newCompletion];
        
        // Calculate new streak for optimistic UI update using frequency-aware calculation
        const newStreak = calculateHabitStreak(habit, newCompletions, 
          prev.failures.filter(f => f.habit_id !== habitId)); // Remove any existing failures
        
        const newLongestStreak = Math.max(newStreak, habit.longest_streak || 0);
        
        // Update habits and filtered habits with new streak
        const updatedHabits = prev.habits.map(h => 
          h.id === habitId ? { 
            ...h, 
            current_streak: newStreak,
            longest_streak: newLongestStreak
          } : h
        );
        
        const updatedFiltered = prev.filteredHabits.map(h => 
          h.id === habitId ? { 
            ...h, 
            current_streak: newStreak,
            longest_streak: newLongestStreak
          } : h
        );
        
        return {
          ...prev,
          habits: updatedHabits,
          filteredHabits: updatedFiltered,
          completions: newCompletions,
          // Remove any failure for this habit when marking as completed
          failures: prev.failures.filter(f => f.habit_id !== habitId)
        };
      }
    });
    
    await handleAction(
      "Toggle completion",
      actionKey,
      pendingActionsRef,
      () => toggleHabitCompletion(habitId, today, isCompleted),
      () => {},
      undefined,
      () => refreshData(false),
      {
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!"
      }
    );
  }, [user, state.completions, state.failures, state.habits, today, setState, findHabit, handleAction, pendingActionsRef, refreshData, calculateHabitStreak]);

  return {
    handleToggleCompletion
  };
}
