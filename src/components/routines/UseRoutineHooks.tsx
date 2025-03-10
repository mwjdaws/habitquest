
import { useState, useCallback } from "react";
import { Routine } from "@/lib/routineTypes";
import { useRoutines } from "@/hooks/useRoutines";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { Habit } from "@/lib/habitTypes";

export function useRoutineHandlers() {
  const {
    routines,
    loading,
    getRoutineWithHabits,
    addRoutine,
    editRoutine,
    removeRoutine,
    addHabitToRoutine,
    removeHabitFromRoutine,
    completeRoutine,
  } = useRoutines();

  const {
    habits: allHabits,
    completions,
    failures,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData,
  } = useHabitTracking();

  const [routineHabitsMap, setRoutineHabitsMap] = useState<Record<string, string[]>>({});
  const [habitsMap, setHabitsMap] = useState<Record<string, Habit>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState<(Routine & { habitIds?: string[] }) | null>(null);
  const [expandedRoutines, setExpandedRoutines] = useState<Record<string, boolean>>({});
  const [failureState, setFailureState] = useState<{
    habitId: string | null;
    habitName: string;
  }>({ habitId: null, habitName: "" });

  const handleCreateRoutine = useCallback(() => {
    setCurrentRoutine(null);
    setFormOpen(true);
  }, []);

  const handleEditRoutine = useCallback((routine: Routine) => {
    getRoutineWithHabits(routine.id)
      .then(({ routine: routineData, habitIds }) => {
        setCurrentRoutine({ ...routineData, habitIds });
        setFormOpen(true);
      })
      .catch(error => {
        console.error("Error loading routine for edit:", error);
      });
  }, [getRoutineWithHabits]);

  const handleSubmitRoutine = useCallback(async (values: any) => {
    try {
      if (currentRoutine) {
        // Update existing routine
        await editRoutine(currentRoutine.id, {
          name: values.name,
          description: values.description,
          time_of_day: values.time_of_day,
        });

        // Get the current habits for this routine
        const currentHabitIds = routineHabitsMap[currentRoutine.id] || [];
        
        // Handle removed habits
        for (const habitId of currentHabitIds) {
          if (!values.habit_ids.includes(habitId)) {
            await removeHabitFromRoutine(currentRoutine.id, habitId);
          }
        }
        
        // Handle added habits
        for (const habitId of values.habit_ids) {
          if (!currentHabitIds.includes(habitId)) {
            await addHabitToRoutine(currentRoutine.id, habitId);
          }
        }
      } else {
        // Create new routine
        const newRoutine = await addRoutine({
          name: values.name,
          description: values.description,
          time_of_day: values.time_of_day,
        });

        // Add habits to the new routine
        if (values.habit_ids && values.habit_ids.length > 0) {
          for (const habitId of values.habit_ids) {
            await addHabitToRoutine(newRoutine.id, habitId);
          }
        }
      }

      // Refresh data
      refreshData();
    } catch (error) {
      console.error("Error saving routine:", error);
    }
  }, [currentRoutine, editRoutine, removeHabitFromRoutine, addHabitToRoutine, addRoutine, refreshData, routineHabitsMap]);

  const handleDeleteRoutine = useCallback(async () => {
    if (!currentRoutine) return;
    
    try {
      await removeRoutine(currentRoutine.id);
      setFormOpen(false);
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  }, [currentRoutine, removeRoutine]);

  const handleToggleExpand = useCallback((routineId: string) => {
    setExpandedRoutines(prev => ({
      ...prev,
      [routineId]: !prev[routineId]
    }));
  }, []);

  const handleCompleteRoutine = useCallback(async (routineId: string) => {
    try {
      await completeRoutine(routineId);
      refreshData();
    } catch (error) {
      console.error("Error completing routine:", error);
    }
  }, [completeRoutine, refreshData]);

  const handleLogHabitFailure = useCallback((habitId: string) => {
    const habit = habitsMap[habitId];
    if (habit) {
      setFailureState({
        habitId,
        habitName: habit.name
      });
    }
  }, [habitsMap]);

  const handleConfirmFailure = useCallback(async (habitId: string, reason: string) => {
    await handleLogFailure(habitId, reason);
    setFailureState({ habitId: null, habitName: "" });
  }, [handleLogFailure]);

  const handleFailureDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setFailureState({ habitId: null, habitName: "" });
  }, []);

  return {
    routines,
    loading,
    routineHabitsMap,
    setRoutineHabitsMap,
    habitsMap,
    setHabitsMap,
    allHabits,
    completions,
    failures,
    formOpen,
    setFormOpen,
    currentRoutine,
    expandedRoutines,
    failureState,
    handleCreateRoutine,
    handleEditRoutine,
    handleSubmitRoutine,
    handleDeleteRoutine,
    handleToggleExpand,
    handleCompleteRoutine,
    handleLogHabitFailure,
    handleConfirmFailure,
    handleFailureDialogOpenChange,
    handleToggleCompletion,
    handleUndoFailure,
    getRoutineWithHabits,
    removeRoutine
  };
}
