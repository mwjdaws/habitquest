
import { useState, useEffect, useCallback } from 'react';
import { fetchTasks } from '@/lib/api/taskAPI';
import { useAuth } from '@/contexts/AuthContext';

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
      
      const tags = tasks
        .filter(task => task.tag) // Filter out tasks without tags
        .map(task => task.tag as string) // Extract the tag
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        .sort(); // Sort alphabetically
      
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
