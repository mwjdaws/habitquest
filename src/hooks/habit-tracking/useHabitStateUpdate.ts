
import { useState, useCallback } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { HabitTrackingState } from "./types";

export const useHabitStateUpdate = () => {
  const [state, setState] = useState<HabitTrackingState>({
    habits: [],
    filteredHabits: [],
    completions: [],
    failures: [],
    loading: true,
    error: null,
    isInitialized: false,
  });

  const addHabit = useCallback((habit: Habit) => {
    setState((prevState) => ({
      ...prevState,
      habits: [...prevState.habits, habit],
    }));
  }, []);

  const completeHabit = useCallback((habitId: string) => {
    setState((prevState) => {
      const habit = prevState.habits.find((h) => h.id === habitId);
      if (!habit) return prevState;

      const completion: HabitCompletion = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: "user-id", // This should be replaced with actual user ID
        completed_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      return {
        ...prevState,
        completions: [...prevState.completions, completion],
      };
    });
  }, []);

  const failHabit = useCallback((habitId: string, reason: string) => {
    setState((prevState) => {
      const failure: HabitFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: "user-id", // This should be replaced with actual user ID
        failure_date: new Date().toISOString(),
        reason: reason,
        created_at: new Date().toISOString(),
      };

      return {
        ...prevState,
        failures: [...prevState.failures, failure],
      };
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      loading,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prevState) => ({
      ...prevState,
      error,
    }));
  }, []);

  const initializeState = useCallback((habits: Habit[]) => {
    setState({
      habits,
      filteredHabits: habits,
      completions: [],
      failures: [],
      loading: false,
      error: null,
      isInitialized: true,
    });
  }, []);

  // Add resetState function that was missing
  const resetState = useCallback(() => {
    setState({
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
    state,
    addHabit,
    completeHabit,
    failHabit,
    setLoading,
    setError,
    initializeState,
    resetState
  };
};
