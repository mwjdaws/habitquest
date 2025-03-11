
import { supabase } from "../supabase";
import { HabitFailure } from "../habitTypes";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";
import { getTodayFormattedInToronto } from "../dateUtils";

/**
 * Gets habit failures for a specific date
 */
export const getFailuresForDate = async (date: string): Promise<HabitFailure[]> => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habit_failures")
      .select("*")
      .eq("failure_date", date)
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    return handleApiError(error, "fetching failures");
  }
};

/**
 * Logs a habit failure with a reason
 */
export const logHabitFailure = async (habitId: string, date: string, reason: string) => {
  try {
    const userId = await getAuthenticatedUser();

    // Check if there's already a failure logged for this date and habit
    const { data: existingFailure, error: checkError } = await supabase
      .from("habit_failures")
      .select("id")
      .eq("habit_id", habitId)
      .eq("failure_date", date)
      .eq("user_id", userId);
    
    if (checkError) throw checkError;
    
    // If there's an existing failure, update it, otherwise insert new
    if (existingFailure && existingFailure.length > 0) {
      const { error } = await supabase
        .from("habit_failures")
        .update({ reason })
        .eq("id", existingFailure[0].id)
        .eq("user_id", userId);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("habit_failures")
        .insert({
          habit_id: habitId,
          failure_date: date,
          reason,
          user_id: userId
        });
      
      if (error) throw error;
    }
    
    // Only reset streak if it's for today's date
    const today = getTodayFormattedInToronto();
    if (date === today) {
      // Reset the streak to 0
      const { error: updateError } = await supabase
        .from("habits")
        .update({ 
          current_streak: 0,
          updated_at: new Date().toISOString()
        })
        .eq("id", habitId)
        .eq("user_id", userId);
      
      if (updateError) throw updateError;
    }
    
  } catch (error) {
    return handleApiError(error, "logging habit failure");
  }
};

/**
 * Removes a habit failure entry to undo a skipped habit
 */
export const removeHabitFailure = async (habitId: string, date: string) => {
  try {
    const userId = await getAuthenticatedUser();

    // Delete the failure entry
    const { error } = await supabase
      .from("habit_failures")
      .delete()
      .eq("habit_id", habitId)
      .eq("failure_date", date)
      .eq("user_id", userId);

    if (error) throw error;

  } catch (error) {
    return handleApiError(error, "removing habit failure");
  }
};
