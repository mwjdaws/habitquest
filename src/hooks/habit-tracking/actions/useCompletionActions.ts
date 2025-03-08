
import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toggleHabitCompletion, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { handleApiError } from "@/lib/error-utils";
import { Habit } from "@/lib/habitTypes";

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

  // Handle toggling habit completion with optimistic updates and request deduplication
  const handleToggleCompletion = useCallback(async (habitId: string) => {
    if (!user) return;
    
    // Prevent duplicate requests
    const actionKey = `toggle-${habitId}`;
    if (pendingActionsRef.current.has(actionKey)) {
      console.log('Toggle action already in progress for habit:', habitId);
      return;
    }
    
    try {
      pendingActionsRef.current.add(actionKey);
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
      
      // Send update to server with timeout safety
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      await Promise.race([
        toggleHabitCompletion(habitId, today, isCompleted),
        timeoutPromise
      ]);
      
      // Silent background refresh to sync with server (no loading indicator)
      // Using a smaller delay to reduce the chance of state mismatch
      setTimeout(() => {
        if (pendingActionsRef.current.has(actionKey)) {
          refreshData(false);
        }
      }, 300);
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      
      // Rollback optimistic update and show error
      refreshData(false);
      
      handleApiError(error, "updating habit status", "Failed to update habit status. Please try again.", true);
    } finally {
      pendingActionsRef.current.delete(actionKey);
    }
  }, [user, state.completions, state.failures, today, setState, refreshData, findHabit]);

  return {
    handleToggleCompletion
  };
}
