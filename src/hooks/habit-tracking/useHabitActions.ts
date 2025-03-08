
import { useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toggleHabitCompletion, logHabitFailure, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "./types";
import { handleApiError } from "@/lib/error-utils";

/**
 * Hook to manage habit completion and failure actions with optimized state updates
 */
export function useHabitActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean) => void
) {
  const { user } = useAuth();
  const today = getTodayFormatted();
  const pendingActionsRef = useRef<Set<string>>(new Set());

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
      
      // Optimistic update with clean management of state
      setState(prev => {
        if (isCompleted) {
          return {
            ...prev,
            completions: prev.completions.filter(c => c.habit_id !== habitId)
          };
        } else {
          const newCompletion = {
            id: crypto.randomUUID(),
            habit_id: habitId,
            user_id: user.id,
            completed_date: today,
            created_at: new Date().toISOString()
          };
          
          return {
            ...prev,
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
      
      // Refresh habit data to get updated streak (but don't show loading state)
      refreshData(false);
      
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
  }, [user, state.completions, state.failures, today, setState, refreshData]);

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
      
      // Optimistic update
      const newFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: user.id,
        failure_date: today,
        reason,
        created_at: new Date().toISOString()
      };
      
      setState(prev => ({
        ...prev,
        // Remove any completions for this habit when marking as failed
        completions: prev.completions.filter(c => c.habit_id !== habitId),
        // Add the failure or replace existing one
        failures: [...prev.failures.filter(f => f.habit_id !== habitId), newFailure]
      }));
      
      // Send to server with timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      await Promise.race([
        logHabitFailure(habitId, today, reason),
        timeoutPromise
      ]);
      
      // Refresh to update streaks
      refreshData(false);
      
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
  }, [user, today, setState, refreshData]);

  return {
    handleToggleCompletion,
    handleLogFailure
  };
}
