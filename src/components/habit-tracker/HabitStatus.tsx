import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFailure } from "@/lib/habitTypes";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  failures: HabitFailure[];
};

export function HabitStatus({
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
  
  // Return failure status if failed
  if (isFailed) {
    return (
      <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center">
        <X className="mr-1 h-3 w-3" />
        {failureReason}
      </div>
    );
  }
  
  // Otherwise show buttons
  return (
    <>
      {!isCompleted && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onLogFailure(habitId)}
        >
          <X className="mr-1 h-3 w-3" />
          Skip
        </Button>
      )}
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
        onClick={() => onToggleCompletion(habitId)}
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
}
