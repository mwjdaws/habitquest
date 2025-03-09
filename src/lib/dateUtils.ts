
import { format, formatISO, parse } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Toronto timezone string
export const TORONTO_TIMEZONE = 'America/Toronto';

/**
 * Converts a date to Toronto timezone
 */
export const toTorontoTime = (date: Date): Date => {
  return toZonedTime(date, TORONTO_TIMEZONE);
};

/**
 * Gets current date in Toronto timezone
 */
export const getCurrentTorontoDate = (): Date => {
  return toTorontoTime(new Date());
};

/**
 * Formats a date to ISO date string (YYYY-MM-DD) in Toronto timezone
 */
export const formatTorontoDate = (date: Date): string => {
  const zonedDate = toTorontoTime(date);
  return formatISO(zonedDate, { representation: 'date' });
};

/**
 * Gets today's date formatted as YYYY-MM-DD in Toronto timezone
 */
export const getTodayFormattedInToronto = (): string => {
  return formatTorontoDate(new Date());
};

/**
 * Format a date with a specific format string in Toronto timezone
 */
export const formatInTorontoTimezone = (date: Date, formatStr: string): string => {
  return formatInTimeZone(date, TORONTO_TIMEZONE, formatStr);
};

/**
 * Gets the day name in Toronto timezone
 */
export const getDayNameInToronto = (date: Date): string => {
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const zonedDate = toTorontoTime(date);
  return weekdays[zonedDate.getDay()];
};
