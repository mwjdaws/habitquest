
import { useCallback } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { HabitTrackingState } from "../types";

/**
 * Hook providing functions to update habit state
 * 
 * These updater functions are designed to be used with React's setState pattern,
 * either directly or with useReducer. They follow the immutable update pattern
 * for React state.
 * 
 * @returns Object containing updater functions for habit state
 */
export const useHabitStateUpdate = () => {
  const addHabit = useCallback((habit: Habit) => {
    return (prevState: HabitTrackingState): HabitTrackingState => ({
      ...prevState,
      habits: [...prevState.habits, habit],
    });
  }, []);

  const completeHabit = useCallback((habitId: string) => {
    return (prevState: HabitTrackingState): HabitTrackingState => {
      const habit = prevState.habits.find((h) => h.id === habitId);
      if (!habit) return prevState;

      const completion: HabitCompletion = {
        id: crypto.randomUUID(),
        habit_id: habitId, // Use habit_id instead of habitId
        user_id: "user-id", // This should be replaced with actual user ID
        completed_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      return {
        ...prevState,
        completions: [...prevState.completions, completion],
      };
    };
  }, []);

  const failHabit = useCallback((habitId: string, reason: string) => {
    return (prevState: HabitTrackingState): HabitTrackingState => {
      const failure: HabitFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId, // Use habit_id instead of habitId
        user_id: "user-id", // This should be replaced with actual user ID
        failure_date: new Date().toISOString(),
        reason: reason,
        created_at: new Date().toISOString(),
      };

      return {
        ...prevState,
        failures: [...prevState.failures, failure],
      };
    };
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    return (prevState: HabitTrackingState): HabitTrackingState => ({
      ...prevState,
      loading,
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    return (prevState: HabitTrackingState): HabitTrackingState => ({
      ...prevState,
      error,
    });
  }, []);

  const initializeState = useCallback((habits: Habit[]) => {
    return (prevState: HabitTrackingState): HabitTrackingState => ({
      ...prevState,
      habits,
      filteredHabits: habits,
      completions: [],
      failures: [],
      loading: false,
      error: null,
      isInitialized: true,
    });
  }, []);

  const resetState = useCallback(() => {
    return (prevState: HabitTrackingState): HabitTrackingState => ({
      ...prevState,
      habits: [],
      filteredHabits: [],
      completions: [],
      failures: [],
      loading: true,
      error: null,
      isInitialized: false,
    });
  }, []);

  return {
    addHabit,
    completeHabit,
    failHabit,
    setLoading,
    setError,
    initializeState,
    resetState,
  };
};
