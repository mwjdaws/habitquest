
import { toast } from "@/components/ui/use-toast";

/**
 * Handles errors in a standardized way across the application.
 * It logs the error, shows a toast notification, and returns a formatted error message.
 */
export function handleError(error: unknown, fallbackMessage = "An unexpected error occurred"): string {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : fallbackMessage;
  
  // Log the error with details
  console.error("Error occurred:", error);
  
  // Show toast notification
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
 * Checks if an error is related to authentication
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('auth') || 
           error.message.toLowerCase().includes('login') ||
           error.message.toLowerCase().includes('permission');
  }
  return false;
}

/**
 * Checks if the error is likely a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch') || 
           error.message.toLowerCase().includes('connection');
  }
  return false;
}

/**
 * Formats a user-friendly error message based on the error type
 */
export function formatErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    return "Authentication error. Please sign in again.";
  } else if (isNetworkError(error)) {
    return "Network error. Please check your connection and try again.";
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return "An unexpected error occurred";
  }
}
