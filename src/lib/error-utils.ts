
import { toast } from "@/components/ui/use-toast";

/**
 * Common user-friendly error messages for technical errors
 */
const USER_FRIENDLY_ERRORS = {
  "Authentication required": "You need to sign in to access this feature",
  "Failed to fetch": "Network connection issue. Please check your internet connection",
  "Network Error": "Unable to connect to the server. Please check your internet connection",
  "Request timeout": "The server is taking too long to respond. Please try again later",
  "Internal Server Error": "We're experiencing technical difficulties. Please try again later",
  "404": "The requested resource could not be found",
  "403": "You don't have permission to access this resource",
  "401": "Your session has expired. Please sign in again",
  "500": "We're experiencing technical difficulties. Please try again later",
  "unknown error": "Something went wrong. Please try again"
};

/**
 * Maps technical error messages to user-friendly ones
 * @param error The technical error message
 * @returns A user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const techMessage = formatErrorMessage(error);
  
  // Check for exact matches
  if (techMessage in USER_FRIENDLY_ERRORS) {
    return USER_FRIENDLY_ERRORS[techMessage as keyof typeof USER_FRIENDLY_ERRORS];
  }
  
  // Check for partial matches
  for (const [errorKey, friendlyMessage] of Object.entries(USER_FRIENDLY_ERRORS)) {
    if (techMessage.toLowerCase().includes(errorKey.toLowerCase())) {
      return friendlyMessage;
    }
  }
  
  // Check for status code matches
  if (techMessage.includes("status code 4") || techMessage.includes("status code 5")) {
    const statusCode = techMessage.match(/status code (\d+)/)?.[1];
    if (statusCode && statusCode in USER_FRIENDLY_ERRORS) {
      return USER_FRIENDLY_ERRORS[statusCode as keyof typeof USER_FRIENDLY_ERRORS];
    }
  }
  
  // Default user-friendly message for unmatched errors
  return "Something unexpected happened. Please try again";
};

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
 * Basic error handler that formats errors and returns the message
 * @param error The error object
 * @param context Optional context about what action was being performed
 * @returns Formatted error message string
 */
export const formatErrorWithContext = (
  error: unknown,
  context?: string
): string => {
  const errorMessage = formatErrorMessage(error);
  return context ? `Error ${context}: ${errorMessage}` : errorMessage;
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
  const errorMessage = formatErrorWithContext(error, actionContext);
  
  console.error(errorMessage);
  
  if (showToast) {
    toast({
      title: "Error",
      description: userFriendlyMessage || getUserFriendlyErrorMessage(error),
      variant: "destructive",
    });
  }
  
  return errorMessage;
};

/**
 * Handles API errors and returns a result with success/error information
 * @param error The error object
 * @param actionName The name of the action that failed
 * @param defaultMessage A default error message
 * @param showToast Whether to show a toast notification
 * @returns Object containing success status and error message
 */
export const handleApiError = <T>(
  error: unknown,
  actionName: string,
  defaultMessage?: string,
  showToast: boolean = true
): { success: false, error: string, data?: T } => {
  const errorMessage = formatErrorWithContext(error, actionName);
  console.error(errorMessage);

  if (showToast) {
    toast({
      title: "Error",
      description: defaultMessage || getUserFriendlyErrorMessage(error),
      variant: "destructive",
    });
  }

  return { 
    success: false, 
    error: errorMessage 
  };
};

/**
 * Wraps an API call with standard error handling
 * @param apiCall The function to execute
 * @param actionName Description of the action
 * @param errorMessage Custom error message to display on failure
 * @param showToast Whether to show error toast
 * @returns Result object with success status, data and error info
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  actionName: string,
  errorMessage?: string,
  showToast: boolean = true
): Promise<{ success: boolean, data?: T, error?: string }> => {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    return handleApiError<T>(error, actionName, errorMessage, showToast);
  }
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
