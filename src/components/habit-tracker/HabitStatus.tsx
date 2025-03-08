
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFailure } from "@/lib/habitTypes";
import { memo } from "react";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  failures: HabitFailure[];
};

// Using memo to prevent unnecessary re-renders
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
  
  // Early return pattern for improved readability and performance
  if (isFailed) {
    return (
      <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center">
        <X className="mr-1 h-3 w-3" />
        {failureReason}
      </div>
    );
  }
  
  // Handler functions
  const handleSkip = () => onLogFailure(habitId);
  const handleToggle = () => onToggleCompletion(habitId);
  
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
});
