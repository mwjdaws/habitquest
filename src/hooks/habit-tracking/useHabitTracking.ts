
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Habit } from "@/lib/habitTypes";
import { useHabitInit } from "./useHabitInit";
import { useHabitActions } from "./useHabitActions";
import { useHabitStats } from "./useHabitStats";
import { useHabitData } from "./data/useHabitData";
import { getTodayFormatted } from "@/lib/habits";

/**
 * This hook integrates all habit tracking functionality into a single interface
 * for use in components.
 * 
 * @param {Function} onHabitChange - Optional callback when habits change
 * @returns {Object} Combined habit tracking functionality
 */
export function useHabitTracking(onHabitChange?: () => void) {
  const { user } = useAuth();
  
  // State for selected date
  const [selectedDate, setSelectedDate] = useState<string>(getTodayFormatted());
  const isToday = useMemo(() => selectedDate === getTodayFormatted(), [selectedDate]);
  
  // Get core data state and functionality
  const { 
    state, 
    refreshData, 
    isInitialized 
  } = useHabitData(onHabitChange, selectedDate);
  
  // Destructure state for easier use
  const { habits, completions, failures, loading, error } = state;
  
  // Initialize habits
  const { initializeHabits } = useHabitInit();
  
  // Get habit actions with selected date
  const { 
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
  } = useHabitActions(state, refreshData);
  
  // Get stats for the current habits and completions
  const { progress, completedCount, totalCount } = useHabitStats(habits, completions, failures, selectedDate);
  
  // Handle date selection changes
  useEffect(() => {
    if (user && isInitialized) {
      console.log(`[useHabitTracking] Date changed to ${selectedDate}, refreshing data`);
      refreshData(true, true); // Force refresh with loading indicator on date change
    }
  }, [selectedDate, user, isInitialized, refreshData]);
  
  // Initialize habits when needed
  useEffect(() => {
    if (user && isInitialized && habits.length === 0 && !loading && !error) {
      initializeHabits();
    }
  }, [user, isInitialized, habits.length, loading, error, initializeHabits]);
  
  // Create integrated API for components
  return useMemo(() => ({
    habits,
    completions,
    failures,
    loading,
    error,
    progress,
    completedCount,
    totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData,
    isInitialized,
    selectedDate,
    setSelectedDate,
    isToday
  }), [
    habits,
    completions,
    failures,
    loading,
    error,
    progress,
    completedCount,
    totalCount,
    handleToggleCompletion,
    handleLogFailure,
    handleUndoFailure,
    refreshData,
    isInitialized,
    selectedDate,
    isToday
  ]);
}
