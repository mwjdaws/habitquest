
import { supabase } from "../../supabase";
import { Habit } from "../../habitTypes";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";

/**
 * Updates an existing habit for the authenticated user
 */
export const updateHabit = async (id: string, habit: Partial<Omit<Habit, "id" | "created_at" | "updated_at" | "user_id">>) => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .update({ ...habit, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
    
  } catch (error) {
    return handleApiError(error, "updating habit");
  }
};
