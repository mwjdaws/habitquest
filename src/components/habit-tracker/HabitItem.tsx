
import { memo, useCallback, useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { Badge } from "@/components/ui/badge";
import { Tag, Zap } from "lucide-react";
import { HabitStatus } from "./HabitStatus";
import { HabitWarningState } from './HabitWarningState';
import { habitItemPropsAreEqual, useHabitStatus } from "@/hooks/habit-tracking/utils/useHabitMemoization";
import { useHabitInactivity } from '@/hooks/habit-tracking/utils/useHabitInactivity';
import { getTodayFormatted } from '@/lib/habits';

type HabitItemProps = {
  habit: Habit;
  completions: HabitCompletion[];
  failures: HabitFailure[];
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  selectedDate?: string;
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitItem = memo(function HabitItem({
  habit,
  completions,
  failures,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  selectedDate = getTodayFormatted()
}: HabitItemProps) {
  // Use our optimized custom hook for status calculations
  const { isCompleted, isFailed, bgColorClass } = useHabitStatus(habit, completions, failures, selectedDate);
  
  // Check for habit inactivity
  const { isInconsistent, isLost, daysInactive } = useHabitInactivity(habit, completions);
  
  // Memoize handlers to prevent new function references on each render
  const handleToggle = useCallback(() => onToggleCompletion(habit.id), [habit.id, onToggleCompletion]);
  const handleFailure = useCallback(() => onLogFailure(habit.id), [habit.id, onLogFailure]);
  const handleUndo = useCallback(() => onUndoFailure(habit.id), [habit.id, onUndoFailure]);
  
  // Handler for reestablishing a lost habit
  const handleReestablish = useCallback(async () => {
    await onToggleCompletion(habit.id);
  }, [habit.id, onToggleCompletion]);
  
  // Pre-compute the color style to avoid recalculation during render
  const colorStyle = useMemo(() => ({
    backgroundColor: habit.color ? `var(--${habit.color})` : 'var(--habit-purple)'
  }), [habit.color]);
  
  return (
    <div className="space-y-0">
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
            selectedDate={selectedDate}
          />
        </div>
      </div>
      
      {/* Display warning for inconsistent or lost habits */}
      {selectedDate === getTodayFormatted() && !isCompleted && !isFailed && (isInconsistent || isLost) && (
        <HabitWarningState 
          type={isLost ? 'lost' : 'inconsistent'} 
          daysInactive={daysInactive}
          onReestablish={isLost ? handleReestablish : undefined}
        />
      )}
    </div>
  );
}, habitItemPropsAreEqual);
