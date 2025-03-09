
import { memo, useCallback, useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { Badge } from "@/components/ui/badge";
import { Tag, Zap } from "lucide-react";
import { HabitStatus } from "./HabitStatus";
import { habitItemPropsAreEqual, useHabitStatus } from "@/hooks/habit-tracking/utils/useHabitMemoization";

type HabitItemProps = {
  habit: Habit;
  completions: HabitCompletion[];
  failures: HabitFailure[];
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitItem = memo(function HabitItem({
  habit,
  completions,
  failures,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure
}: HabitItemProps) {
  // Use our optimized custom hook for status calculations
  const { isCompleted, isFailed, bgColorClass, failureReason } = useHabitStatus(habit, completions, failures);
  
  // Memoize handlers to prevent new function references on each render
  const handleToggle = useCallback(() => onToggleCompletion(habit.id), [habit.id, onToggleCompletion]);
  const handleFailure = useCallback(() => onLogFailure(habit.id), [habit.id, onLogFailure]);
  const handleUndo = useCallback(() => onUndoFailure(habit.id), [habit.id, onUndoFailure]);
  
  // Pre-compute the color style to avoid recalculation during render
  const colorStyle = useMemo(() => ({
    backgroundColor: habit.color ? `var(--${habit.color})` : 'var(--habit-purple)'
  }), [habit.color]);
  
  return (
    <div 
      className={`p-2 rounded-md flex items-center justify-between gap-4 border ${bgColorClass}`}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-10 rounded-full" 
          style={colorStyle}
        />
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm flex items-center gap-2">
              {habit.name}
              {habit.current_streak > 0 && (
                <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              <Tag className="h-3 w-3 mr-1" />
              {habit.category}
            </Badge>
          </div>
          {habit.description && (
            <div className="text-xs text-muted-foreground">
              {habit.description}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <HabitStatus 
          habitId={habit.id}
          isCompleted={isCompleted}
          isFailed={isFailed}
          onToggleCompletion={handleToggle}
          onLogFailure={handleFailure}
          onUndoFailure={handleUndo}
          failures={failures}
        />
      </div>
    </div>
  );
}, habitItemPropsAreEqual);
