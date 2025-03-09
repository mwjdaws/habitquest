import { memo } from "react";
import { HabitFailure } from "@/lib/habitTypes";
import { StatusButtons } from "./habit-status/StatusButtons";
import { FailedStatus } from "./habit-status/FailedStatus";
import { useFailureInfo } from "./habit-status/useFailureInfo";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  failures: HabitFailure[];
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitStatus = memo(function HabitStatus({
  habitId,
  isCompleted,
  isFailed,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  failures
}: HabitStatusProps) {
  // Get failure reason if available - using custom hook for clarity
  const failureInfo = useFailureInfo(habitId, isFailed, failures);
  
  // Early return pattern for improved rendering performance
  if (isFailed) {
    return (
      <FailedStatus 
        habitId={habitId}
        failureReason={failureInfo}
        onUndoFailure={onUndoFailure}
      />
    );
  }
  
  return (
    <StatusButtons
      habitId={habitId}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      onLogFailure={onLogFailure}
    />
  );
}, (prevProps, nextProps) => {
  // Optimized comparison logic that short-circuits early
  if (prevProps.habitId !== nextProps.habitId) return false;
  if (prevProps.isCompleted !== nextProps.isCompleted) return false;
  if (prevProps.isFailed !== nextProps.isFailed) return false;
  
  // Only compare the relevant failure when needed
  if (prevProps.isFailed && nextProps.isFailed) {
    const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habitId);
    const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habitId);
    return prevFailure?.reason === nextFailure?.reason;
  }
  
  // If we get here, other props are unchanged
  return true;
});
