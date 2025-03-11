
import { useRef } from "react";
import { HabitTrackingState } from "./types";
import { useHabitFinder } from "./utils/useHabitFinder";
import { useCompletionActions } from "./actions/useCompletionActions";
import { useFailureActions } from "./actions/useFailureActions";

/**
 * Centralized hook for managing all habit action operations with optimized rendering
 * 
 * This hook orchestrates completion and failure actions with a shared pending
 * actions reference to prevent duplicate operations and race conditions.
 *
 * @param {HabitTrackingState} state - Current habit tracking state
 * @param {React.Dispatch<React.SetStateAction<HabitTrackingState>>} setState - State setter function
 * @param {function} refreshData - Function to refresh all habit data
 * @returns {Object} Collection of habit action handlers
 * 
 * @example
 * const { handleToggleCompletion, handleLogFailure } = useHabitActions(state, setState, refreshData);
 * // Later: handleToggleCompletion(habitId);
 */
export function useHabitActions(
  state: HabitTrackingState,
  setState: React.Dispatch<React.SetStateAction<HabitTrackingState>>,
  refreshData: (showLoading?: boolean, forceRefresh?: boolean) => void
) {
  // Shared reference for tracking pending actions to prevent duplicates
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
