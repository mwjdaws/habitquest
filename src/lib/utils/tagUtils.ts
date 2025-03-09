
/**
 * Utility functions for working with tags
 */

// Unified cache object for all tag-related operations
const tagCache = {
  formatted: new Map<string, string | null>(),
  processed: new Map<string, string | null>(),
  validation: new Map<string, boolean>(),
};

/**
 * Formats tag value to ensure consistency
 * Returns null for empty strings
 */
export const formatTagValue = (tag: string | undefined | null): string | null => {
  if (tag === undefined || tag === null) return null;
  
  const cacheKey = tag;
  if (tagCache.formatted.has(cacheKey)) {
    return tagCache.formatted.get(cacheKey)!;
  }
  
  const result = tag.trim() || null;
  tagCache.formatted.set(cacheKey, result);
  return result;
};

/**
 * Extracts unique tags from a list of tasks
 */
export const extractUniqueTags = (tasks: any[]): string[] => {
  // Use Set for faster uniqueness check and reduce iterations
  const uniqueTags = new Set<string>();
  
  tasks.forEach(task => {
    if (task.tag) {
      uniqueTags.add(task.tag);
    }
  });
  
  // Convert Set to sorted array
  return Array.from(uniqueTags).sort();
};

/**
 * Validates if a tag is valid (non-empty after trimming)
 */
export const isValidTag = (tag: string | undefined | null): boolean => {
  if (tag === undefined || tag === null) return false;
  
  const cacheKey = tag;
  if (tagCache.validation.has(cacheKey)) {
    return tagCache.validation.get(cacheKey)!;
  }
  
  const result = Boolean(tag.trim());
  tagCache.validation.set(cacheKey, result);
  return result;
};

/**
 * Processes a new custom tag, ensuring it's properly formatted
 */
export const processCustomTag = (tag: string | undefined | null): string | null => {
  if (tag === undefined || tag === null) return null;
  
  const cacheKey = tag;
  if (tagCache.processed.has(cacheKey)) {
    return tagCache.processed.get(cacheKey);
  }
  
  const trimmed = tag.trim();
  if (!trimmed) return null;
  
  // Process the tag
  const result = trimmed.toLowerCase().replace(/\s+/g, '-');
  tagCache.processed.set(cacheKey, result);
  return result;
};

/**
 * Clears the tag cache
 * Useful for testing or when tag processing rules change
 */
export const clearTagCache = (): void => {
  tagCache.formatted.clear();
  tagCache.processed.clear();
  tagCache.validation.clear();
};
