
/**
 * Utility functions for working with tags
 */

// Cache for processed tags to avoid repeated operations
const processedTagCache = new Map<string, string | null>();
const validationCache = new Map<string, boolean>();

/**
 * Formats tag value to ensure consistency
 * Returns null for empty strings
 */
export const formatTagValue = (tag: string | undefined | null): string | null => {
  if (tag === undefined || tag === null) return null;
  
  // Use cached result if available
  const cacheKey = `format_${tag}`;
  if (processedTagCache.has(cacheKey)) {
    return processedTagCache.get(cacheKey)!;
  }
  
  const result = tag.trim() || null;
  processedTagCache.set(cacheKey, result);
  return result;
};

/**
 * Extracts unique tags from a list of tasks
 */
export const extractUniqueTags = (tasks: any[]): string[] => {
  // Use Set for faster uniqueness check
  const uniqueTags = new Set<string>();
  
  for (const task of tasks) {
    if (task.tag) {
      uniqueTags.add(task.tag);
    }
  }
  
  // Convert Set to sorted array
  return Array.from(uniqueTags).sort();
};

/**
 * Validates if a tag is valid (non-empty after trimming)
 */
export const isValidTag = (tag: string | undefined | null): boolean => {
  if (tag === undefined || tag === null) return false;
  
  // Use cached result if available
  if (validationCache.has(tag)) {
    return validationCache.get(tag)!;
  }
  
  const result = Boolean(tag.trim());
  validationCache.set(tag, result);
  return result;
};

/**
 * Processes a new custom tag, ensuring it's properly formatted
 */
export const processCustomTag = (tag: string | undefined | null): string | null => {
  if (tag === undefined || tag === null || !tag.trim()) return null;
  
  // Use cached result if available
  const cacheKey = `process_${tag}`;
  if (processedTagCache.has(cacheKey)) {
    return processedTagCache.get(cacheKey);
  }
  
  // Process the tag
  const result = tag.trim().toLowerCase().replace(/\s+/g, '-');
  processedTagCache.set(cacheKey, result);
  return result;
};
