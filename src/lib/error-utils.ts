import { toast } from "@/components/ui/use-toast";

/**
 * Handles errors in a standardized way across the application.
 * It logs the error, shows a toast notification, and returns a formatted error message.
 */
export function handleError(error: unknown, fallbackMessage = "An unexpected error occurred"): string {
  // Extract error message
  const errorMessage = formatErrorMessage(error) || fallbackMessage;
  
  // Log the error with additional context for better debugging
  console.error("Error occurred:", error);
  
  // Show toast notification with consistent formatting
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
  
  return errorMessage;
}

/**
 * Safely executes an async function with standardized error handling.
 * Returns [data, error] similar to the Go pattern.
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallbackMessage = "An unexpected error occurred"
): Promise<[T | null, string | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const errorMessage = handleError(error, fallbackMessage);
    return [null, errorMessage];
  }
}

/**
 * Enhanced retry mechanism for network operations
 * @param fn The async function to execute
 * @param retries Number of retry attempts
 * @param delay Delay between retries in ms
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  retries = 3, 
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.log(`Operation failed, retrying... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(fn, retries - 1, delay * 1.5); // Exponential backoff
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
           message.includes('unauthorized');
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
           message.includes('timeout');
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

/**
 * Gracefully handle API errors with recovery options
 */
export function handleApiError(error: unknown, operation: string): void {
  const isNetwork = isNetworkError(error);
  const isAuth = isAuthError(error);
  
  console.error(`API Error during ${operation}:`, error);
  
  if (isNetwork) {
    toast({
      title: "Connection Issue",
      description: "We're having trouble connecting to the server. Please check your internet connection.",
      variant: "destructive",
    });
  } else if (isAuth) {
    toast({
      title: "Authentication Required",
      description: "Please sign in again to continue.",
      variant: "destructive",
    });
    // Could trigger a refresh of auth token or redirect to login here
  } else {
    toast({
      title: "Error",
      description: `Failed to ${operation}. Please try again later.`,
      variant: "destructive",
    });
  }
}
