
import { Habit } from "./habitTypes";
import { 
  formatTorontoDate, 
  getTodayFormattedInToronto, 
  getDayNameInToronto 
} from "./dateUtils";

/**
 * Formats a Date object to ISO string date (YYYY-MM-DD) in Toronto timezone
 */
export const formatDate = formatTorontoDate;

/**
 * Gets today's date formatted as YYYY-MM-DD in Toronto timezone
 */
export const getTodayFormatted = getTodayFormattedInToronto;

/**
 * Gets the day name (e.g., "monday") from a Date object in Toronto timezone
 */
export const getDayName = getDayNameInToronto;

/**
 * Determines if a habit should be shown for a specific day
 * based on its frequency settings
 */
export const shouldShowHabitForDay = (habit: Habit, dayName: string): boolean => {
  // Empty frequency array means the habit should show every day
  return habit.frequency.length === 0 || habit.frequency.includes(dayName.toLowerCase());
};
