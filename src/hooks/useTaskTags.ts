
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchTasks } from '@/lib/api/taskAPI';
import { useAuth } from '@/contexts/AuthContext';
import { extractUniqueTags, formatTagValue } from '@/lib/utils/tagUtils';

/**
 * Hook to manage task tags with fetching and caching functionality
 */
export function useTaskTags() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();

  // Add stable refs for commonly used values
  const hasUser = Boolean(user);
  
  // Function to load tags from the API
  const loadTags = useCallback(async (force: boolean = false) => {
    // Don't fetch if not logged in
    if (!hasUser) {
      setAvailableTags([]);
      return;
    }
    
    // Skip if we have data and this isn't a forced refresh (simple caching)
    if (!force && availableTags.length > 0 && lastUpdated) {
      const cacheAge = Date.now() - lastUpdated.getTime();
      const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes
      
      if (cacheAge < CACHE_MAX_AGE) {
        console.log('Using cached tags, age:', Math.round(cacheAge/1000), 'seconds');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      const tasks = await fetchTasks();
      
      const tags = extractUniqueTags(tasks);
      
      setAvailableTags(tags);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tags'));
      console.error("Failed to load tags:", err);
    } finally {
      setIsLoading(false);
    }
  }, [hasUser, availableTags.length, lastUpdated]);

  // Load tags on component mount and when user changes
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Sort tags for consistent display
  const sortedTags = useMemo(() => {
    return [...availableTags].sort((a, b) => a.localeCompare(b));
  }, [availableTags]);

  return {
    availableTags: sortedTags,
    isLoading,
    error,
    refreshTags: () => loadTags(true),
    lastUpdated
  };
}
