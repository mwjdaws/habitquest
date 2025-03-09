
import { useState, useCallback } from 'react';

interface UseLoadingErrorResult {
  loading: boolean;
  error: Error | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  handleLoading: <T>(promise: Promise<T>) => Promise<T>;
  resetState: () => void;
}

/**
 * Custom hook to manage loading and error states for async operations
 */
export function useLoadingError(): UseLoadingErrorResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  const handleLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await promise;
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setLoading,
    setError,
    handleLoading,
    resetState
  };
}
