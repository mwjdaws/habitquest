
import { useState, useEffect, useCallback } from 'react';
import { fetchTasks } from '@/lib/api/taskAPI';
import { useAuth } from '@/contexts/AuthContext';
import { extractUniqueTags } from '@/lib/utils/tagUtils';

/**
 * Hook to manage task tags with fetching and caching functionality
 */
export function useTaskTags() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const loadTags = useCallback(async () => {
    if (!user) {
      setAvailableTags([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const tasks = await fetchTasks();
      
      const tags = extractUniqueTags(tasks);
      
      setAvailableTags(tags);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tags'));
      console.error("Failed to load tags:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load tags on component mount and when user changes
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    availableTags,
    isLoading,
    error,
    refreshTags: loadTags
  };
}
