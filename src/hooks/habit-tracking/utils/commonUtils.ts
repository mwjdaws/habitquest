
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";

/**
 * Returns the lowercase name of the current day of the week
 * 
 * @returns {string} Lowercase day name (e.g., "monday", "tuesday")
 */
export const getTodayName = (): string => {
  const date = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()].toLowerCase();
};

/**
 * Determines if a habit should be displayed for today based on its frequency settings
 * 
 * @param {Habit} habit - The habit to check
 * @param {string} todayName - Lowercase name of current day (e.g., "monday")
 * @returns {boolean} True if the habit should be shown today, false otherwise
 * 
 * @example
 * const today = getTodayName();
 * const shouldShow = isHabitForToday(habit, today);
 */
export const isHabitForToday = (habit: Habit, todayName: string): boolean => {
  return habit.frequency.length === 0 || habit.frequency.includes(todayName);
};

/**
 * Creates a default state object for habit tracking with all properties initialized
 * 
 * @returns {HabitTrackingState} A fresh state object with default values
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
