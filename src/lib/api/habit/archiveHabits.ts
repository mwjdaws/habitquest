
import { supabase } from "../../supabase";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";

/**
 * Archives a habit (soft delete)
 */
export const archiveHabit = async (id: string) => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .update({ 
        archived: true,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
    
  } catch (error) {
    return handleApiError(error, "archiving habit");
  }
};

/**
 * Unarchives a previously archived habit
 */
export const unarchiveHabit = async (id: string) => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .update({ 
        archived: false,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
    
  } catch (error) {
    return handleApiError(error, "unarchiving habit");
  }
};
