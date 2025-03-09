
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { safeApiCall } from '@/lib/error-utils';

/**
 * A generic hook for safely executing data mutations with loading and error handling
 */
export function useSafeMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T, params: P) => void;
    onError?: (error: Error, params: P) => void;
    successMessage?: string;
    errorMessage?: string;
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (params: P) => {
    setIsLoading(true);
    setError(null);

    const result = await safeApiCall(
      () => mutationFn(params),
      options?.errorMessage || 'processing request'
    );

    if (result.success) {
      if (options?.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
      
      if (options?.onSuccess) {
        options.onSuccess(result.data as T, params);
      }
    } else {
      setError(new Error(result.error));
      
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      
      if (options?.onError) {
        options.onError(new Error(result.error), params);
      }
    }

    setIsLoading(false);
    return result.success ? (result.data as T) : undefined;
  }, [mutationFn, options]);

  return {
    mutate,
    isLoading,
    error,
    reset: () => setError(null)
  };
}
