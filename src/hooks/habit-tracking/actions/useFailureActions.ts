
import { useCallback } from "react";
import { logHabitFailure, removeHabitFailure, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useActionHandler } from "../utils/useActionHandler";

/**
 * Hook for managing habit failure and undo failure actions
 */
export function useFailureActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean) => void,
  findHabit: (habitId: string) => Habit | undefined,
  pendingActionsRef: React.MutableRefObject<Set<string>>
) {
  const { user } = useAuth();
  const today = getTodayFormatted();
  const { handleAction } = useActionHandler();

  // Handle logging habit failure with improved error handling and optimistic updates
  const handleLogFailure = useCallback(async (habitId: string, reason: string) => {
    if (!user) return;
    
    const actionKey = `failure-${habitId}`;
    const habit = findHabit(habitId);
    
    if (!habit) {
      console.error('Could not find habit with ID:', habitId);
      return;
    }
    
    // Optimistic update with improved state management
    const newFailure = {
      id: crypto.randomUUID(),
      habit_id: habitId,
      user_id: user.id,
      failure_date: today,
      reason,
      created_at: new Date().toISOString()
    };
    
    setState(prev => {
      // Update habits and filtered habits with reset streak
      const updatedHabits = prev.habits.map(h => 
        h.id === habitId ? { ...h, current_streak: 0 } : h
      );
      
      const updatedFiltered = prev.filteredHabits.map(h => 
        h.id === habitId ? { ...h, current_streak: 0 } : h
      );
      
      return {
        ...prev,
        habits: updatedHabits,
        filteredHabits: updatedFiltered,
        // Remove any completions for this habit when marking as failed
        completions: prev.completions.filter(c => c.habit_id !== habitId),
        // Add the failure or replace existing one
        failures: [...prev.failures.filter(f => f.habit_id !== habitId), newFailure]
      };
    });
    
    await handleAction(
      "Log failure",
      actionKey,
      pendingActionsRef,
      () => logHabitFailure(habitId, today, reason),
      () => {},
      undefined,
      () => refreshData(false),
      {
        title: "Reason logged",
        description: "Thanks for your honesty. You'll do better tomorrow!"
      }
    );
  }, [user, today, setState, refreshData, findHabit, handleAction, pendingActionsRef]);

  // Handle undoing a skipped habit (remove failure entry)
  const handleUndoFailure = useCallback(async (habitId: string) => {
    if (!user) return;
    
    const actionKey = `undo-failure-${habitId}`;
    const habit = findHabit(habitId);
    
    if (!habit) {
      console.error('Could not find habit with ID:', habitId);
      return;
    }
    
    // Optimistic update
    setState(prev => {
      return {
        ...prev,
        // Remove the failure for this habit
        failures: prev.failures.filter(f => f.habit_id !== habitId)
      };
    });
    
    await handleAction(
      "Undo failure",
      actionKey,
      pendingActionsRef,
      () => removeHabitFailure(habitId, today),
      () => {},
      undefined,
      () => refreshData(false),
      {
        title: "Skip undone",
        description: "You can now mark this habit as complete."
      }
    );
  }, [user, today, setState, refreshData, findHabit, handleAction, pendingActionsRef]);

  return {
    handleLogFailure,
    handleUndoFailure
  };
}
