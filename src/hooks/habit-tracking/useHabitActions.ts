
import { useRef } from "react";
import { HabitTrackingState } from "./types";
import { useHabitFinder } from "./utils/useHabitFinder";
import { useCompletionActions } from "./actions/useCompletionActions";
import { useFailureActions } from "./actions/useFailureActions";

/**
 * Hook to manage habit completion and failure actions with optimized state updates
 */
export function useHabitActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean) => void
) {
  // Shared reference for tracking pending actions
  const pendingActionsRef = useRef<Set<string>>(new Set());
  
  // Get the habit finder utility
  const findHabit = useHabitFinder(state);

  // Get completion actions
  const { handleToggleCompletion } = useCompletionActions(
    state, 
    setState, 
    refreshData, 
    findHabit, 
    pendingActionsRef
  );

  // Get failure actions
  const { handleLogFailure, handleUndoFailure } = useFailureActions(
    state, 
    setState, 
    refreshData, 
    findHabit, 
    pendingActionsRef
  );

  return {
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure
  };
}
