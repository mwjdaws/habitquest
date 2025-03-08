import { toast } from "@/components/ui/use-toast";

/**
 * Handles errors in a standardized way across the application.
 * It logs the error, optionally shows a toast notification, and returns a formatted error message.
 */
export function handleError(
  error: unknown, 
  fallbackMessage = "An unexpected error occurred", 
  showToast = true
): string {
  // Extract error message
  const errorMessage = formatErrorMessage(error) || fallbackMessage;
  
  // Log the error with additional context for better debugging
  console.error("Error occurred:", error);
  
  // Optionally show toast notification
  if (showToast) {
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
  
  return errorMessage;
}

/**
 * Enhanced API error handler with better context and recovery options
 * Combines both previous implementations into one unified function
 */
export function handleApiError(
  error: unknown, 
  operation: string, 
  fallbackMessage = "An unexpected error occurred",
  showToast = true
): string {
  const isNetwork = isNetworkError(error);
  const isAuth = isAuthError(error);
  
  console.error(`API Error during ${operation}:`, error);
  
  let message = fallbackMessage;
  
  if (isNetwork) {
    message = "We're having trouble connecting to the server. Please check your internet connection.";
  } else if (isAuth) {
    message = "Authentication error. Please sign in again.";
    // Could trigger a refresh of auth token or redirect to login here
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = `Failed to ${operation}. Please try again later.`;
  }
  
  if (showToast) {
    toast({
      title: isNetwork ? "Connection Issue" : isAuth ? "Authentication Required" : "Error",
      description: message,
      variant: "destructive",
    });
  }
  
  return message;
}

/**
 * Safely executes an async function with standardized error handling.
 * Returns [data, error] similar to the Go pattern.
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallbackMessage = "An unexpected error occurred",
  showToast = true
): Promise<[T | null, string | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const errorMessage = handleError(error, fallbackMessage, showToast);
    return [null, errorMessage];
  }
}

/**
 * Enhanced retry mechanism for network operations with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  retries = 2, 
  initialDelay = 300,
  maxDelay = 3000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Apply some jitter to avoid thundering herd problem
    const jitter = Math.random() * 100;
    const delay = Math.min(initialDelay, maxDelay) + jitter;
    
    console.log(`Operation failed, retrying... (${retries} attempts left) after ${Math.round(delay)}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(fn, retries - 1, initialDelay * 1.5, maxDelay);
  }
}

/**
 * Checks if an error is related to authentication
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('auth') || 
           message.includes('login') ||
           message.includes('permission') ||
           message.includes('credentials') ||
           message.includes('unauthorized') ||
           message.includes('token') ||
           message.includes('jwt');
  }
  return false;
}

/**
 * Checks if the error is likely a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') ||
           message.includes('fetch') || 
           message.includes('connection') ||
           message.includes('offline') ||
           message.includes('failed to') ||
           message.includes('timeout') ||
           message.includes('abort') ||
           // Check for network error status
           /failed with status: (0|4[0-9]{2}|5[0-9]{2})/.test(message);
  }
  // Check if it's a DOMException for aborted requests
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }
  return false;
}

/**
 * Formats a user-friendly error message based on the error type
 */
export function formatErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred";
  
  if (isAuthError(error)) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
        return "Invalid email or password. Please try again.";
      }
      
      if (message.includes('email not confirmed')) {
        return "Please confirm your email before logging in.";
      }
      
      if (message.includes('already registered')) {
        return "This email is already registered. Please log in instead.";
      }
      
      return "Authentication error. Please sign in again.";
    }
  } 
  
  if (isNetworkError(error)) {
    return "Network error. Please check your connection and try again.";
  } 
  
  if (error instanceof Error) {
    return error.message;
  } 
  
  if (typeof error === 'string') {
    return error;
  } 
  
  return "An unexpected error occurred";
}
