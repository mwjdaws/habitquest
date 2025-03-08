
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toggleHabitCompletion, logHabitFailure, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "./types";

/**
 * Hook to manage habit completion and failure actions
 */
export function useHabitActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean) => void
) {
  const { user } = useAuth();
  const today = getTodayFormatted();

  // Handle toggling habit completion with optimistic updates
  const handleToggleCompletion = useCallback(async (habitId: string) => {
    if (!user) return;
    
    try {
      const isCompleted = state.completions.some(c => c.habit_id === habitId);
      
      // Optimistic update - update UI immediately
      if (isCompleted) {
        setState(prev => ({
          ...prev,
          completions: prev.completions.filter(c => c.habit_id !== habitId)
        }));
      } else {
        const newCompletion = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          created_at: new Date().toISOString()
        };
        
        setState(prev => ({
          ...prev,
          completions: [...prev.completions, newCompletion],
          // Remove any failure for this habit on this day
          failures: prev.failures.filter(f => f.habit_id !== habitId)
        }));
      }
      
      // Send update to server
      await toggleHabitCompletion(habitId, today, isCompleted);
      
      // Refresh habit data to get updated streak (but don't show loading state)
      refreshData(false);
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      
      // Rollback optimistic update
      refreshData(false);
      
      toast({
        title: "Error",
        description: "Failed to update habit status. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, state.completions, state.failures, today, setState, refreshData]);

  // Handle logging habit failure
  const handleLogFailure = useCallback(async (habitId: string, reason: string) => {
    if (!user) return;
    
    try {
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
        // Remove any completions for this habit on this day
        completions: prev.completions.filter(c => c.habit_id !== habitId),
        // Add the failure or replace existing one
        failures: [...prev.failures.filter(f => f.habit_id !== habitId), newFailure]
      }));
      
      // Send to server
      await logHabitFailure(habitId, today, reason);
      
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
      
      toast({
        title: "Error",
        description: "Failed to log failure reason. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, today, setState, refreshData]);

  return {
    handleToggleCompletion,
    handleLogFailure
  };
}
