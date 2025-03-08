
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { logHabitFailure, removeHabitFailure, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { handleApiError } from "@/lib/error-utils";
import { Habit } from "@/lib/habitTypes";

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

  // Handle logging habit failure with improved error handling and optimistic updates
  const handleLogFailure = useCallback(async (habitId: string, reason: string) => {
    if (!user) return;
    
    // Prevent duplicate requests
    const actionKey = `failure-${habitId}`;
    if (pendingActionsRef.current.has(actionKey)) {
      console.log('Failure action already in progress for habit:', habitId);
      return;
    }
    
    try {
      pendingActionsRef.current.add(actionKey);
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
      
      // Send to server with timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      await Promise.race([
        logHabitFailure(habitId, today, reason),
        timeoutPromise
      ]);
      
      // Silent background refresh after a short delay
      setTimeout(() => {
        if (pendingActionsRef.current.has(actionKey)) {
          refreshData(false);
        }
      }, 300);
      
      toast({
        title: "Reason logged",
        description: "Thanks for your honesty. You'll do better tomorrow!",
      });
    } catch (error) {
      console.error("Error logging failure:", error);
      
      // Rollback optimistic update
      refreshData(false);
      
      handleApiError(error, "logging failure reason", "Failed to log failure reason. Please try again.", true);
    } finally {
      pendingActionsRef.current.delete(actionKey);
    }
  }, [user, today, setState, refreshData, findHabit]);

  // Handle undoing a skipped habit (remove failure entry)
  const handleUndoFailure = useCallback(async (habitId: string) => {
    if (!user) return;
    
    // Prevent duplicate requests
    const actionKey = `undo-failure-${habitId}`;
    if (pendingActionsRef.current.has(actionKey)) {
      console.log('Undo action already in progress for habit:', habitId);
      return;
    }
    
    try {
      pendingActionsRef.current.add(actionKey);
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
      
      // Send to server with timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      await Promise.race([
        removeHabitFailure(habitId, today),
        timeoutPromise
      ]);
      
      // Silent background refresh after a short delay
      setTimeout(() => {
        if (pendingActionsRef.current.has(actionKey)) {
          refreshData(false);
        }
      }, 300);
      
      toast({
        title: "Skip undone",
        description: "You can now mark this habit as complete.",
      });
    } catch (error) {
      console.error("Error undoing failure:", error);
      
      // Rollback optimistic update
      refreshData(false);
      
      handleApiError(error, "undoing skipped habit", "Failed to undo skipped habit. Please try again.", true);
    } finally {
      pendingActionsRef.current.delete(actionKey);
    }
  }, [user, today, setState, refreshData, findHabit]);

  return {
    handleLogFailure,
    handleUndoFailure
  };
}
