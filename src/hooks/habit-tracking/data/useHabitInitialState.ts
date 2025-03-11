
import { useMemo } from "react";
import { HabitTrackingState } from "../types";
import { createDefaultHabitState } from "../utils/commonUtils";

/**
 * Custom hook that provides the initial state for habit tracking
 * 
 * This hook uses useMemo to create a stable reference to the default state object,
 * preventing unnecessary re-renders and ensuring consistent initialization.
 * 
 * @returns {HabitTrackingState} A default habit tracking state object
 * 
 * @example
 * const initialState = useHabitInitialState();
 * const [state, setState] = useState(initialState);
 */
export function useHabitInitialState(): Omit<HabitTrackingState, 'setState'> {
  return useMemo(() => createDefaultHabitState(), []);
}
