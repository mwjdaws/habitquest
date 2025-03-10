
import { supabase } from "../supabase";
import { formatErrorMessage, getUserFriendlyErrorMessage, safeApiCall } from "../error-utils";

/**
 * Validates that the user is authenticated and retrieves their user ID
 * 
 * This function checks the current session and throws a standardized error
 * if the user is not authenticated.
 * 
 * @returns {Promise<string>} User ID if authenticated
 * @throws {Error} If user is not authenticated or session retrieval fails
 * 
 * @example
 * try {
 *   const userId = await getAuthenticatedUser();
 *   // proceed with authenticated operation
 * } catch (error) {
 *   // handle authentication error
 * }
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
 * Standardized handler for API errors with optional default return value
 * 
 * This function provides consistent error handling across the application,
 * with proper logging and the option to either throw or return a default value.
 * 
 * @template T - Type of the return value
 * @param {unknown} error - The error object
 * @param {string} actionName - Description of the action that failed (for logs)
 * @param {T} [defaultReturn] - Optional default value to return instead of throwing
 * @returns {T | never} The default value if provided, otherwise throws
 * @throws {Error} Formatted error message if no default value is provided
 * 
 * @example
 * try {
 *   // API operation
 * } catch (error) {
 *   return handleApiError(error, "fetching data", []);
 * }
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
 * Safely executes a database operation with consistent error handling
 * 
 * This is a higher-order function that wraps database operations with
 * standardized error handling and optional default return values.
 * 
 * @template T - Type of the operation result
 * @param {() => Promise<T>} operation - Database operation to execute
 * @param {string} actionName - Description of the action (for logs)
 * @param {T} [defaultValue] - Optional default value to return on error
 * @returns {Promise<T>} Result of the operation or default value
 * @throws {Error} If operation fails and no default value is provided
 * 
 * @example
 * const data = await safeDbOperation(
 *   () => supabase.from('table').select('*'),
 *   "fetching items",
 *   []
 * );
 */
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  actionName: string,
  defaultValue?: T
): Promise<T> {
  const result = await safeApiCall(operation, actionName, undefined, false);
  
  if (result.success) {
    return result.data as T;
  }
  
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  throw new Error(result.error);
}
