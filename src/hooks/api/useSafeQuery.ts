
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { safeApiCall } from '@/lib/error-utils';

/**
 * A generic hook for safely fetching data with loading and error handling
 */
export function useSafeQuery<T>(
  fetchFn: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    defaultValue?: T;
    successMessage?: string;
    errorMessage?: string;
  }
) {
  const [data, setData] = useState<T | undefined>(options?.defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    const result = await safeApiCall(
      fetchFn,
      options?.errorMessage || 'fetching data',
      undefined // Changed from options?.defaultValue to undefined
    );

    if (result.success) {
      setData(result.data as T);
      
      if (options?.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
      
      if (options?.onSuccess) {
        options.onSuccess(result.data as T);
      }
    } else {
      setError(new Error(result.error));
      
      if (options?.onError) {
        options.onError(new Error(result.error));
      }
    }

    if (showLoading) setIsLoading(false);
    return result.success ? (result.data as T) : undefined;
  }, [fetchFn, options]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    setData
  };
}
