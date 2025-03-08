
import { memo } from 'react';
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
};

// Using memo to prevent unnecessary re-renders
export const HabitItem = memo(function HabitItem({
  habit,
  completions,
  failures,
  onToggleCompletion,
  onLogFailure
}: HabitItemProps) {
  const isCompleted = completions.some(c => c.habit_id === habit.id);
  const isFailed = failures.some(f => f.habit_id === habit.id);
  
  // Determine background color based on status
  const bgColorClass = isCompleted 
    ? "bg-green-50 border-green-200" 
    : isFailed 
      ? "bg-red-50 border-red-200" 
      : "bg-background";
  
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
          onToggleCompletion={onToggleCompletion}
          onLogFailure={onLogFailure}
          failures={failures}
        />
      </div>
    </div>
  );
});
