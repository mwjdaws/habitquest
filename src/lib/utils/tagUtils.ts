
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

/**
 * Validates if a tag is valid (non-empty after trimming)
 */
export const isValidTag = (tag: string | undefined | null): boolean => {
  return Boolean(tag?.trim());
};

/**
 * Processes a new custom tag, ensuring it's properly formatted
 */
export const processCustomTag = (tag: string | undefined | null): string | null => {
  const trimmed = tag?.trim() || '';
  
  // Reject empty tags
  if (!trimmed) return null;
  
  // Enforce custom tag formatting rules
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};
