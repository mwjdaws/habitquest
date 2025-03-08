
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFailure } from "@/lib/habitTypes";
import { memo, useCallback } from "react";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  failures: HabitFailure[];
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitStatus = memo(function HabitStatus({
  habitId,
  isCompleted,
  isFailed,
  onToggleCompletion,
  onLogFailure,
  failures
}: HabitStatusProps) {
  // Get failure reason if available
  const failureReason = isFailed ? 
    failures.find(f => f.habit_id === habitId)?.reason || "Failed" : 
    null;
  
  // Memoize handlers to prevent new function references on each render
  const handleSkip = useCallback(() => onLogFailure(habitId), [habitId, onLogFailure]);
  const handleToggle = useCallback(() => onToggleCompletion(habitId), [habitId, onToggleCompletion]);
  
  // Early return pattern for improved readability and performance
  if (isFailed) {
    return (
      <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center">
        <X className="mr-1 h-3 w-3" />
        {failureReason}
      </div>
    );
  }
  
  return (
    <>
      {!isCompleted && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleSkip}
        >
          <X className="mr-1 h-3 w-3" />
          Skip
        </Button>
      )}
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
        onClick={handleToggle}
      >
        {isCompleted ? (
          <>
            <Check className="mr-1 h-3 w-3" />
            Done
          </>
        ) : (
          "Complete"
        )}
      </Button>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.isFailed === nextProps.isFailed &&
    prevProps.habitId === nextProps.habitId &&
    // Only compare the relevant failure for this habit
    JSON.stringify(prevProps.failures.find(f => f.habit_id === prevProps.habitId)) === 
    JSON.stringify(nextProps.failures.find(f => f.habit_id === nextProps.habitId));
});
