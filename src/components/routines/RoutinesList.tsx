
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoutines } from "@/hooks/useRoutines";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { RoutineCard } from "./RoutineCard";
import { RoutineForm } from "./RoutineForm";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { Routine } from "@/lib/routineTypes";
import { Habit } from "@/lib/habitTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoutinesList() {
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
  }, [routines, getRoutineWithHabits]);

  // Build a map of habit IDs to habit objects for easier lookup
  useEffect(() => {
    const map: Record<string, Habit> = {};
    allHabits.forEach(habit => {
      map[habit.id] = habit;
    });
    setHabitsMap(map);
  }, [allHabits]);

  const handleCreateRoutine = () => {
    setCurrentRoutine(null);
    setFormOpen(true);
  };

  const handleEditRoutine = (routine: Routine) => {
    getRoutineWithHabits(routine.id)
      .then(({ routine: routineData, habitIds }) => {
        setCurrentRoutine({ ...routineData, habitIds });
        setFormOpen(true);
      })
      .catch(error => {
        console.error("Error loading routine for edit:", error);
      });
  };

  const handleSubmitRoutine = async (values: any) => {
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
  };

  const handleDeleteRoutine = async () => {
    if (!currentRoutine) return;
    
    try {
      await removeRoutine(currentRoutine.id);
      setFormOpen(false);
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  const handleToggleExpand = (routineId: string) => {
    setExpandedRoutines(prev => ({
      ...prev,
      [routineId]: !prev[routineId]
    }));
  };

  const handleCompleteRoutine = async (routineId: string) => {
    try {
      const completedHabitIds = await completeRoutine(routineId);
      refreshData();
    } catch (error) {
      console.error("Error completing routine:", error);
    }
  };

  const handleLogHabitFailure = (habitId: string) => {
    const habit = habitsMap[habitId];
    if (habit) {
      setFailureState({
        habitId,
        habitName: habit.name
      });
    }
  };

  const handleConfirmFailure = async (habitId: string, reason: string) => {
    await handleLogFailure(habitId, reason);
    setFailureState({ habitId: null, habitName: "" });
  };

  const handleFailureDialogOpenChange = (open: boolean) => {
    if (!open) setFailureState({ habitId: null, habitName: "" });
  };

  // Get the routines sorted by time of day
  const sortedRoutines = [...routines].sort((a, b) => {
    const timeOrder: Record<string, number> = {
      'morning': 1,
      'afternoon': 2,
      'evening': 3,
      'night': 4,
      '': 5, // Routines without time_of_day will be sorted last
    };
    
    const timeA = a.time_of_day || '';
    const timeB = b.time_of_day || '';
    
    return (timeOrder[timeA] || 99) - (timeOrder[timeB] || 99);
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Routines</h2>
          <Button onClick={handleCreateRoutine} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Routine</span>
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-10">
              <div className="flex justify-center">
                <div className="animate-pulse h-6 w-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : routines.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex flex-col items-center text-center">
              <p className="text-muted-foreground mb-4">You haven't created any routines yet.</p>
              <Button onClick={handleCreateRoutine} variant="outline">
                Create Your First Routine
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedRoutines.map((routine) => {
              const routineHabitIds = routineHabitsMap[routine.id] || [];
              const routineHabits = routineHabitIds
                .map(id => habitsMap[id])
                .filter(Boolean);
              
              return (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  habits={routineHabits}
                  completions={completions}
                  failures={failures}
                  expanded={expandedRoutines[routine.id]}
                  onToggleExpand={handleToggleExpand}
                  onEdit={handleEditRoutine}
                  onDelete={removeRoutine}
                  onCompleteRoutine={handleCompleteRoutine}
                  onToggleHabit={handleToggleCompletion}
                  onLogFailure={handleLogHabitFailure}
                  onUndoFailure={handleUndoFailure}
                />
              );
            })}
          </div>
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
