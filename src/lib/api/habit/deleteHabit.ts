
import { supabase } from "../../supabase";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";

/**
 * Deletes a habit for the authenticated user
 * This function first deletes related records in habit_completions, habit_failures, and key_results
 * before deleting the habit itself
 */
export const deleteHabit = async (id: string) => {
  console.log(`Starting deletion process for habit ID: ${id}`);
  try {
    const userId = await getAuthenticatedUser();
    console.log(`Authenticated user ID: ${userId}`);

    // First delete related key_results (added this step to fix FK constraint)
    console.log(`Step 1: Deleting key_results for habit ID: ${id}`);
    const { error: keyResultsError } = await supabase
      .from("key_results")
      .delete()
      .eq("habit_id", id);
    
    if (keyResultsError) {
      console.error(`Error deleting key_results: ${keyResultsError.message}`);
      throw keyResultsError;
    }
    console.log("Key results deleted successfully");
    
    // Then delete related habit completions
    console.log(`Step 2: Deleting completions for habit ID: ${id}`);
    const { error: completionsError } = await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", id);

    if (completionsError) {
      console.error(`Error deleting completions: ${completionsError.message}`);
      throw completionsError;
    }
    console.log("Completions deleted successfully");
    
    // Then delete related habit failures
    console.log(`Step 3: Deleting failures for habit ID: ${id}`);
    const { error: failuresError } = await supabase
      .from("habit_failures")
      .delete()
      .eq("habit_id", id);
    
    if (failuresError) {
      console.error(`Error deleting failures: ${failuresError.message}`);
      throw failuresError;
    }
    console.log("Failures deleted successfully");

    // Add a small delay to ensure all related records are processed by the database
    await new Promise(resolve => setTimeout(resolve, 500));

    // Finally delete the habit itself
    console.log(`Step 4: Deleting habit ID: ${id}`);
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error(`Error deleting habit: ${error.message}`);
      throw error;
    }
    
    console.log("Habit deleted successfully");
    
    // Add a small delay before returning to ensure UI has time to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return true to indicate successful deletion
    return true;
    
  } catch (error) {
    console.error("Deletion process failed:", error);
    return handleApiError(error, "deleting habit");
  }
};
