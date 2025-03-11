
import { memo, useMemo } from "react";
import { HabitFailure } from "@/lib/habitTypes";
import { StatusButtons } from "./habit-status/StatusButtons";
import { FailedStatus } from "./habit-status/FailedStatus";
import { useFailureInfo } from "./habit-status/useFailureInfo";
import { getTodayFormatted } from "@/lib/habits";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  failures: HabitFailure[];
  selectedDate?: string;
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitStatus = memo(function HabitStatus({
  habitId,
  isCompleted,
  isFailed,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  failures,
  selectedDate = getTodayFormatted()
}: HabitStatusProps) {
  // Get failure reason if available - using custom hook for clarity
  const failureInfo = useFailureInfo(habitId, isFailed, failures);
  
  // Memoize component instances to prevent recreating them on each render
  const failedStatusComponent = useMemo(() => {
    if (!isFailed) return null;
    
    return (
      <FailedStatus 
        habitId={habitId}
        failureReason={failureInfo}
        onUndoFailure={onUndoFailure}
      />
    );
  }, [habitId, isFailed, failureInfo, onUndoFailure]);
  
  const statusButtonsComponent = useMemo(() => {
    if (isFailed) return null;
    
    return (
      <StatusButtons
        habitId={habitId}
        isCompleted={isCompleted}
        onToggleCompletion={onToggleCompletion}
        onLogFailure={onLogFailure}
        selectedDate={selectedDate}
      />
    );
  }, [habitId, isCompleted, isFailed, onToggleCompletion, onLogFailure, selectedDate]);
  
  // Early return pattern for improved rendering performance
  return isFailed ? failedStatusComponent : statusButtonsComponent;
}, (prevProps, nextProps) => {
  // Optimized comparison logic that short-circuits early
  if (prevProps.habitId !== nextProps.habitId) return false;
  if (prevProps.isCompleted !== nextProps.isCompleted) return false;
  if (prevProps.isFailed !== nextProps.isFailed) return false;
  if (prevProps.selectedDate !== nextProps.selectedDate) return false;
  
  // Only compare the relevant failure when needed
  if (prevProps.isFailed && nextProps.isFailed) {
    // Use Map for O(1) lookups instead of find() which is O(n)
    const prevFailureMap = new Map(prevProps.failures.map(f => [f.habit_id, f]));
    const nextFailureMap = new Map(nextProps.failures.map(f => [f.habit_id, f]));
    
    const prevFailure = prevFailureMap.get(prevProps.habitId);
    const nextFailure = nextFailureMap.get(nextProps.habitId);
    
    // Check if reasons differ
    return prevFailure?.reason === nextFailure?.reason;
  }
  
  // If we get here, other props are unchanged
  return true;
});
