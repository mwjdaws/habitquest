
import { useCallback } from "react";
import { logHabitFailure, removeHabitFailure, getTodayFormatted } from "@/lib/habits";
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useActionHandler } from "../utils/useActionHandler";
import { toast } from "@/components/ui/use-toast";
import { isPastDate } from "../utils/commonUtils";

/**
 * Hook for managing habit failure actions
 */
export function useFailureActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean, forceRefresh?: boolean) => void,
  findHabit: (habitId: string) => Habit | undefined,
  pendingActionsRef: React.MutableRefObject<Set<string>>,
  selectedDate: string = getTodayFormatted()
) {
  const { user } = useAuth();
  const { handleAction } = useActionHandler();
  
  // Log a habit failure with reason
  const handleLogFailure = useCallback(async (habitId: string, reason: string) => {
    if (!user) return;
    
    // Prevent logging failures for past dates
    if (isPastDate(selectedDate)) {
      toast({
        title: "Cannot log failures for past dates",
        description: "You can only log failures for today.",
        variant: "destructive"
      });
      return;
    }
    
    const actionKey = `fail-${habitId}-${selectedDate}`;
    const habit = findHabit(habitId);
    
    if (!habit) {
      console.error('Could not find habit with ID:', habitId);
      return;
    }
    
    // Optimistic update with immutable state management
    setState(prev => {
      // Add the failure to the state
      const newFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: user.id,
        reason,
        failure_date: selectedDate,
        created_at: new Date().toISOString()
      };
      
      // Mark the streak as broken if this is for today
      let updatedHabits = prev.habits;
      let updatedFiltered = prev.filteredHabits;
      
      if (selectedDate === getTodayFormatted()) {
        // Reset streak to 0 for this habit
        updatedHabits = prev.habits.map(h => 
          h.id === habitId ? { ...h, current_streak: 0 } : h
        );
        
        updatedFiltered = prev.filteredHabits.map(h => 
          h.id === habitId ? { ...h, current_streak: 0 } : h
        );
      }
      
      return {
        ...prev,
        habits: updatedHabits,
        filteredHabits: updatedFiltered,
        failures: [...prev.failures, newFailure],
        // Remove any completion for this habit when marking as failed
        completions: prev.completions.filter(c => 
          !(c.habit_id === habitId && c.completed_date === selectedDate)
        )
      };
    });
    
    await handleAction(
      "Log failure",
      actionKey,
      pendingActionsRef,
      () => logHabitFailure(habitId, selectedDate, reason),
      () => {},
      undefined,
      () => refreshData(false, true), // Force refresh to ensure we get the latest data
      {
        title: "Habit skipped",
        description: "Keep going, tomorrow is a new day!"
      }
    );
    
  }, [user, selectedDate, setState, findHabit, handleAction, pendingActionsRef, refreshData]);

  // Remove a habit failure
  const handleUndoFailure = useCallback(async (habitId: string) => {
    if (!user) return;
    
    // Prevent undoing failures for past dates
    if (isPastDate(selectedDate)) {
      toast({
        title: "Cannot modify past failures",
        description: "Past habit failures cannot be changed.",
        variant: "destructive"
      });
      return;
    }
    
    const actionKey = `undofail-${habitId}-${selectedDate}`;
    
    // Optimistic update with immutable state management
    setState(prev => {
      return {
        ...prev,
        // Remove the failure from state
        failures: prev.failures.filter(f => 
          !(f.habit_id === habitId && f.failure_date === selectedDate)
        )
      };
    });
    
    await handleAction(
      "Undo failure",
      actionKey,
      pendingActionsRef,
      () => removeHabitFailure(habitId, selectedDate),
      () => {},
      undefined,
      () => refreshData(false, true), // Force refresh to ensure we get the latest data
      {
        title: "Habit restored",
        description: "Failure has been removed"
      }
    );
    
  }, [user, selectedDate, setState, handleAction, pendingActionsRef, refreshData]);

  return {
    handleLogFailure,
    handleUndoFailure
  };
}
