
/**
 * Utility functions for working with tags
 */

/**
 * Formats tag value to ensure consistency
 * Returns null for empty strings
 */
export const formatTagValue = (tag: string | undefined | null): string | null => {
  return tag?.trim() || null;
};

/**
 * Extracts unique tags from a list of tasks
 */
export const extractUniqueTags = (tasks: any[]): string[] => {
  return tasks
    .filter(task => task.tag) // Filter out tasks without tags
    .map(task => task.tag as string) // Extract the tag
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .sort(); // Sort alphabetically
};

