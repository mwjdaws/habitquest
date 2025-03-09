
import { supabase } from "../supabase";
import { Habit } from "../habitTypes";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";

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
      query = query.is('archived', null).or('archived.eq.false');
    }
      
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    return handleApiError(error, "fetching habits");
  }
};

/**
 * Creates a new habit for the authenticated user
 */
export const createHabit = async (habit: Omit<Habit, "id" | "created_at" | "updated_at" | "user_id" | "current_streak" | "longest_streak">) => {
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

/**
 * Deletes a habit for the authenticated user
 */
export const deleteHabit = async (id: string) => {
  try {
    const userId = await getAuthenticatedUser();

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
    
  } catch (error) {
    return handleApiError(error, "deleting habit");
  }
};

/**
 * Gets habit statistics for a specific habit over a period
 */
export const getHabitStats = async (habitId: string, days: number) => {
  try {
    const userId = await getAuthenticatedUser();

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", userId)
      .gte("completed_date", startDate.toISOString().split("T")[0])
      .lte("completed_date", endDate.toISOString().split("T")[0]);

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    return handleApiError(error, "fetching habit stats");
  }
};
