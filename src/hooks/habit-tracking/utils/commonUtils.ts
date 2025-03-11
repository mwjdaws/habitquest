
import { HabitTrackingState } from "../types";
import { Habit } from "@/lib/habitTypes";

/**
 * Creates a default habit tracking state object with empty arrays and default values
 * 
 * @returns {HabitTrackingState} Default habit tracking state
 */
export function createDefaultHabitState(): HabitTrackingState {
  return {
    habits: [],
    filteredHabits: [],
    completions: [],
    failures: [],
    loading: false,
    error: null,
    isInitialized: false
  };
}

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
 * Compares two dates to check if they are the same day
 * 
 * @param {string} date1 - First date in YYYY-MM-DD format
 * @param {string} date2 - Second date in YYYY-MM-DD format
 * @returns {boolean} True if dates represent the same day
 */
export const areSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Checks if a given date is in the past compared to today
 * 
 * @param {string} date - Date to check in YYYY-MM-DD format
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  return compareDate < today;
};

/**
 * Checks if a given date is today
 * 
 * @param {string} date - Date to check in YYYY-MM-DD format
 * @returns {boolean} True if the date is today
 */
export const isToday = (date: string): boolean => {
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  return date === todayFormatted;
};
