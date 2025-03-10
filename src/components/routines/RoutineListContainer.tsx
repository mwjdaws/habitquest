
import { useEffect, useMemo } from "react";
import { RoutineCard } from "./RoutineCard";
import { Habit } from "@/lib/habitTypes";

interface RoutineListContainerProps {
  routines: any[];
  routineHabitsMap: Record<string, string[]>;
  habitsMap: Record<string, Habit>;
  completions: any[];
  failures: any[];
  expandedRoutines: Record<string, boolean>;
  onToggleExpand: (routineId: string) => void;
  onEdit: (routine: any) => void;
  onDelete: (routineId: string) => void;
  onCompleteRoutine: (routineId: string) => void;
  onToggleHabit: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
}

export function RoutineListContainer({
  routines,
  routineHabitsMap,
  habitsMap,
  completions,
  failures,
  expandedRoutines,
  onToggleExpand,
  onEdit,
  onDelete,
  onCompleteRoutine,
  onToggleHabit,
  onLogFailure,
  onUndoFailure
}: RoutineListContainerProps) {
  
  // Sort routines by time of day
  const sortedRoutines = useMemo(() => {
    return [...routines].sort((a, b) => {
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
  }, [routines]);

  return (
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
            onToggleExpand={onToggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
            onCompleteRoutine={onCompleteRoutine}
            onToggleHabit={onToggleHabit}
            onLogFailure={onLogFailure}
            onUndoFailure={onUndoFailure}
          />
        );
      })}
    </div>
  );
}
