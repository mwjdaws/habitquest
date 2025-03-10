
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";

/**
 * Helper function to get today's name once
 */
export const getTodayName = (): string => {
  const date = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()].toLowerCase();
};

/**
 * Function to determine if a habit should be shown for today
 */
export const isHabitForToday = (habit: Habit, todayName: string): boolean => {
  return habit.frequency.length === 0 || habit.frequency.includes(todayName);
};

/**
 * Create a default state object for habit tracking
 */
export const createDefaultHabitState = (): HabitTrackingState => ({
  habits: [],
  filteredHabits: [],
  completions: [],
  failures: [],
  loading: true,
  error: null,
  isInitialized: false
});
