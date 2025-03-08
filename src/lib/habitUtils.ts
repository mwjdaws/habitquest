
import { Habit } from "./habitTypes";

/**
 * Formats a Date object to ISO string date (YYYY-MM-DD)
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Gets today's date formatted as YYYY-MM-DD
 */
export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

/**
 * Gets the day name (e.g., "monday") from a Date object
 */
export const getDayName = (date: Date): string => {
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return weekdays[date.getDay()];
};

/**
 * Determines if a habit should be shown for a specific day
 * based on its frequency settings
 */
export const shouldShowHabitForDay = (habit: Habit, dayName: string): boolean => {
  // Empty frequency array means the habit should show every day
  return habit.frequency.length === 0 || habit.frequency.includes(dayName.toLowerCase());
};
