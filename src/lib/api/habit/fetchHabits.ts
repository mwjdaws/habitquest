
import { supabase } from "../../supabase";
import { Habit } from "../../habitTypes";
import { getAuthenticatedUser, handleApiError } from "../apiUtils";

/**
 * Fetches all habits for the authenticated user
 * @param includeArchived Whether to include archived habits
 */
export const fetchHabits = async (includeArchived: boolean = false): Promise<Habit[]> => {
  try {
    const userId = await getAuthenticatedUser();

    let query = supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);
    
    // Filter out archived habits by default
    if (!includeArchived) {
      query = query.eq('archived', false);
    }
      
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    return handleApiError(error, "fetching habits");
  }
};
