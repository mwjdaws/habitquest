import { toast } from "@/components/ui/use-toast";

/**
 * Formats an error message from various error types
 * @param error The error object
 * @returns A formatted error message string
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  } else {
    return 'An unknown error occurred.';
  }
};

/**
 * Handles API errors and displays a toast notification
 * @param error The error object
 * @param actionName The name of the action that failed
 * @param defaultMessage A default error message
 * @param showToast Whether to show a toast notification
 */
export const handleApiError = (
  error: unknown,
  actionName: string,
  defaultMessage: string,
  showToast: boolean = true
): string => {
  const errorMessage = `Error ${actionName}: ${formatErrorMessage(error)}`;
  console.error(errorMessage);

  if (showToast) {
    toast({
      title: "Error",
      description: defaultMessage,
      variant: "destructive",
    });
  }

  return errorMessage;
};

/**
 * Attempts to execute a function multiple times if it fails
 * @param fn The function to retry
 * @param retries Number of retry attempts
 * @param signal Optional AbortSignal to cancel retries
 * @returns The result of the function
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  signal?: AbortSignal
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Check if the operation should be aborted
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      
      // Attempt to execute the function
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If aborted, don't retry
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
      
      // Don't delay on the last attempt
      if (attempt < retries) {
        // Exponential backoff with jitter
        const delay = Math.min(Math.pow(2, attempt) * 100 + Math.random() * 100, 2000);
        console.log(`Retrying after ${delay}ms (attempt ${attempt + 1}/${retries})`);
        
        // Create a promise that resolves after the delay or rejects if aborted
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(resolve, delay);
          
          // If we have a signal, add an abort listener
          if (signal) {
            const abortHandler = () => {
              clearTimeout(timeoutId);
              reject(new DOMException("Aborted", "AbortError"));
            };
            
            signal.addEventListener("abort", abortHandler, { once: true });
            
            // Clean up the abort listener when the timeout resolves
            setTimeout(() => {
              signal.removeEventListener("abort", abortHandler);
            }, delay);
          }
        });
      }
    }
  }
  
  throw lastError;
};
