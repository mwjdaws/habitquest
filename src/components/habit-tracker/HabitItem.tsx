
import { memo, useCallback, useMemo } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { Badge } from "@/components/ui/badge";
import { Tag, Zap } from "lucide-react";
import { HabitStatus } from "./HabitStatus";

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
  // Memoize status checks to prevent recalculations
  const { isCompleted, isFailed, failureReason } = useMemo(() => {
    const isCompleted = completions.some(c => c.habit_id === habit.id);
    const isFailed = failures.some(f => f.habit_id === habit.id);
    const failureReason = isFailed 
      ? failures.find(f => f.habit_id === habit.id)?.reason || "" 
      : "";
    
    return { isCompleted, isFailed, failureReason };
  }, [habit.id, completions, failures]);
  
  // Memoize handlers to prevent new function references on each render
  const handleToggle = useCallback(() => onToggleCompletion(habit.id), [habit.id, onToggleCompletion]);
  const handleFailure = useCallback(() => onLogFailure(habit.id), [habit.id, onLogFailure]);
  const handleUndo = useCallback(() => onUndoFailure(habit.id), [habit.id, onUndoFailure]);
  
  // Determine background color based on status - memoized
  const bgColorClass = useMemo(() => 
    isCompleted 
      ? "bg-green-50 border-green-200" 
      : isFailed 
        ? "bg-red-50 border-red-200" 
        : "bg-background"
  , [isCompleted, isFailed]);
  
  // Performance tracking helper - uncomment for debugging
  // useEffect(() => {
  //   console.log(`HabitItem ${habit.name} rendered`);
  // });
  
  return (
    <div 
      className={`p-2 rounded-md flex items-center justify-between gap-4 border ${bgColorClass}`}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-10 rounded-full" 
          style={{ backgroundColor: `var(--${habit.color})` }}
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
}, (prevProps, nextProps) => {
  // Enhanced comparison function to prevent unnecessary re-renders
  
  // First, check identity of core habit properties that affect rendering
  if (prevProps.habit.id !== nextProps.habit.id ||
      prevProps.habit.name !== nextProps.habit.name ||
      prevProps.habit.color !== nextProps.habit.color ||
      prevProps.habit.description !== nextProps.habit.description ||
      prevProps.habit.category !== nextProps.habit.category ||
      prevProps.habit.current_streak !== nextProps.habit.current_streak) {
    return false; // Render if any of these changed
  }
  
  // Then check completion status
  const prevCompleted = prevProps.completions.some(c => c.habit_id === prevProps.habit.id);
  const nextCompleted = nextProps.completions.some(c => c.habit_id === nextProps.habit.id);
  if (prevCompleted !== nextCompleted) {
    return false; // Render if completion status changed
  }
  
  // Then check failure status and reason
  const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habit.id);
  const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habit.id);
  
  // If both are undefined or null, they're equal
  if (!prevFailure && !nextFailure) {
    return true;
  }
  
  // If one is defined and the other isn't, they're not equal
  if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) {
    return false;
  }
  
  // If both are defined, compare their reasons
  if (prevFailure && nextFailure) {
    return prevFailure.reason === nextFailure.reason;
  }
  
  // Default to re-rendering if we can't determine equality
  return false;
});
