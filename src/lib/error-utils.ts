
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
 * Checks if an error is a network connection error
 * @param error The error to check
 * @returns Boolean indicating if it's a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Check common network error messages
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('internet') ||
      message.includes('offline') ||
      message.includes('connection') ||
      message.includes('unreachable') ||
      message.includes('timeout') ||
      message.includes('failed to fetch') ||
      // Check for specific browser network error types
      error.name === 'NetworkError' ||
      error.name === 'AbortError' ||
      error.name === 'TimeoutError'
    );
  }
  return false;
};

/**
 * General error handler that formats errors and shows toast notifications when needed
 * @param error The error object
 * @param actionContext Optional context about what action was being performed
 * @param userFriendlyMessage Optional user-friendly message to display
 * @param showToast Whether to show a toast notification
 * @returns Formatted error message string
 */
export const handleError = (
  error: unknown,
  actionContext?: string,
  userFriendlyMessage?: string,
  showToast: boolean = true
): string => {
  const errorMessage = formatErrorMessage(error);
  const contextMessage = actionContext ? `Error ${actionContext}: ${errorMessage}` : errorMessage;
  
  console.error(contextMessage);
  
  if (showToast && userFriendlyMessage) {
    toast({
      title: "Error",
      description: userFriendlyMessage,
      variant: "destructive",
    });
  }
  
  return errorMessage;
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
