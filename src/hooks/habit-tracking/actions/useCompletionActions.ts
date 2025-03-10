
import { useCallback } from "react";
import { toggleHabitCompletion, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useActionHandler } from "../utils/useActionHandler";

/**
 * Hook for managing habit completion actions
 */
export function useCompletionActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean) => void,
  findHabit: (habitId: string) => Habit | undefined,
  pendingActionsRef: React.MutableRefObject<Set<string>>
) {
  const { user } = useAuth();
  const today = getTodayFormatted();
  const { handleAction } = useActionHandler();

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
        // Calculate new streak for optimistic UI update
        const newStreak = Math.max(0, (habit.current_streak || 0) - 1);
        
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
          completions: prev.completions.filter(c => c.habit_id !== habitId)
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
        
        // Calculate new streak for optimistic UI update
        const newStreak = (habit.current_streak || 0) + 1;
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
          completions: [...prev.completions, newCompletion],
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
  }, [user, state.completions, state.failures, today, setState, findHabit, handleAction, pendingActionsRef, refreshData]);

  return {
    handleToggleCompletion
  };
}
