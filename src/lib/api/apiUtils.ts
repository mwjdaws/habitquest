
import { supabase } from "../supabase";
import { formatErrorMessage, getUserFriendlyErrorMessage } from "../error-utils";

/**
 * Validates that the user is authenticated
 * @returns User ID if authenticated, throws error if not
 */
export async function getAuthenticatedUser(): Promise<string> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error("Authentication required");
    }
    return session.session.user.id;
  } catch (error) {
    // Enhanced error for authentication issues
    const originalMessage = formatErrorMessage(error);
    throw new Error(
      originalMessage === "Authentication required" 
        ? "Authentication required" 
        : `Authentication failed: ${originalMessage}`
    );
  }
}

/**
 * Base function to handle API errors consistently
 * @param error The error object
 * @param actionName Description of the action that failed
 * @param defaultReturn Optional default value to return instead of throwing
 */
export const handleApiError = <T>(
  error: unknown, 
  actionName: string, 
  defaultReturn?: T
): T | never => {
  const errorMessage = formatErrorMessage(error);
  const userFriendlyMessage = getUserFriendlyErrorMessage(error);
  
  console.error(`Error ${actionName}:`, error);
  console.error(`User friendly message: ${userFriendlyMessage}`);
  
  if (defaultReturn !== undefined) {
    return defaultReturn;
  }
  
  throw new Error(errorMessage);
};

/**
 * Safely executes a database operation with proper error handling
 * @param operation Function to execute
 * @param actionName Description of the action
 * @param defaultValue Optional default value to return on error
 */
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  actionName: string,
  defaultValue?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return handleApiError(error, actionName, defaultValue);
  }
}
