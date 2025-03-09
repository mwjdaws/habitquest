
import { supabase } from "../../supabase";
import { Habit } from "../../habitTypes";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";

/**
 * Creates a new habit for the authenticated user
 */
export const createHabit = async (habit: Omit<Habit, "id" | "created_at" | "updated_at" | "user_id" | "current_streak" | "longest_streak" | "archived">) => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .insert({
        ...habit,
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        archived: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
    
  } catch (error) {
    return handleApiError(error, "creating habit");
  }
};
