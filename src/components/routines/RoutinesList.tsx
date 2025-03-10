
import { useEffect } from "react";
import { RoutineForm } from "./RoutineForm";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { RoutineHeader } from "./RoutineHeader";
import { EmptyRoutines } from "./EmptyRoutines";
import { LoadingRoutines } from "./LoadingRoutines";
import { RoutineListContainer } from "./RoutineListContainer";
import { useRoutineHandlers } from "./UseRoutineHooks";

export function RoutinesList() {
  const {
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
    getRoutineWithHabits
  } = useRoutineHandlers();

  // Load habit data for each routine
  useEffect(() => {
    const loadRoutineHabits = async () => {
      const habitsData: Record<string, string[]> = {};
      
      for (const routine of routines) {
        try {
          const { habitIds } = await getRoutineWithHabits(routine.id);
          habitsData[routine.id] = habitIds;
        } catch (error) {
          console.error(`Error loading habits for routine ${routine.id}:`, error);
          habitsData[routine.id] = [];
        }
      }
      
      setRoutineHabitsMap(habitsData);
    };
    
    if (routines.length > 0) {
      loadRoutineHabits();
    }
  }, [routines, getRoutineWithHabits, setRoutineHabitsMap]);

  // Build a map of habit IDs to habit objects for easier lookup
  useEffect(() => {
    const map: Record<string, Habit> = {};
    allHabits.forEach(habit => {
      map[habit.id] = habit;
    });
    setHabitsMap(map);
  }, [allHabits, setHabitsMap]);

  return (
    <>
      <div className="space-y-4">
        <RoutineHeader onCreateRoutine={handleCreateRoutine} />

        {loading ? (
          <LoadingRoutines />
        ) : routines.length === 0 ? (
          <EmptyRoutines onCreateRoutine={handleCreateRoutine} />
        ) : (
          <RoutineListContainer
            routines={routines}
            routineHabitsMap={routineHabitsMap}
            habitsMap={habitsMap}
            completions={completions}
            failures={failures}
            expandedRoutines={expandedRoutines}
            onToggleExpand={handleToggleExpand}
            onEdit={handleEditRoutine}
            onDelete={handleDeleteRoutine}
            onCompleteRoutine={handleCompleteRoutine}
            onToggleHabit={handleToggleCompletion}
            onLogFailure={handleLogHabitFailure}
            onUndoFailure={handleUndoFailure}
          />
        )}
      </div>

      <RoutineForm
        open={formOpen}
        onOpenChange={setFormOpen}
        routine={currentRoutine || undefined}
        onSubmit={handleSubmitRoutine}
        onDelete={currentRoutine ? handleDeleteRoutine : undefined}
      />

      <FailureDialog
        habitId={failureState.habitId || ""}
        habitName={failureState.habitName}
        open={!!failureState.habitId}
        onOpenChange={handleFailureDialogOpenChange}
        onConfirm={handleConfirmFailure}
        onCancel={() => setFailureState({ habitId: null, habitName: "" })}
      />
    </>
  );
}
