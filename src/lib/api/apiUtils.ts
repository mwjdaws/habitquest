
import { supabase } from "../supabase";
import { formatErrorMessage } from "../error-utils";

/**
 * Validates that the user is authenticated
 * @returns User ID if authenticated, throws error if not
 */
export async function getAuthenticatedUser(): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error("Authentication required");
  }
  return session.session.user.id;
}

/**
 * Base function to handle API errors consistently
 */
export const handleApiError = (error: unknown, actionName: string): never => {
  console.error(`Error ${actionName}:`, error);
  throw new Error(formatErrorMessage(error));
};
