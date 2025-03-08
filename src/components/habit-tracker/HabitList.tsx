
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { HabitItem } from "./HabitItem";

type HabitListProps = {
  habits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
};

export function HabitList({
  habits,
  completions,
  failures,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure
}: HabitListProps) {
  return (
    <div className="space-y-2">
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          completions={completions}
          failures={failures}
          onToggleCompletion={onToggleCompletion}
          onLogFailure={onLogFailure}
          onUndoFailure={onUndoFailure}
        />
      ))}
    </div>
  );
}
