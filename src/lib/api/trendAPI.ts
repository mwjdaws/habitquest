
import { supabase } from "../supabase";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";
import { HabitCompletion, HabitFailure } from "../habitTypes";

/**
 * Get habit completion trend data for a time period
 */
export const getCompletionTrends = async (
  days: number
): Promise<HabitCompletion[]> => {
  try {
    const userId = await getAuthenticatedUser();

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("user_id", userId)
      .gte("completed_date", startDate.toISOString().split("T")[0])
      .lte("completed_date", endDate.toISOString().split("T")[0]);

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching completion trends");
  }
};

/**
 * Get habit failure reasons for a time period
 */
export const getFailureTrends = async (
  days: number
): Promise<HabitFailure[]> => {
  try {
    const userId = await getAuthenticatedUser();

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const { data, error } = await supabase
      .from("habit_failures")
      .select("*")
      .eq("user_id", userId)
      .gte("failure_date", startDate.toISOString().split("T")[0])
      .lte("failure_date", endDate.toISOString().split("T")[0]);

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching failure trends");
  }
};

/**
 * Get streak records for all habits
 */
export const getStreakRecords = async () => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .select("id, name, current_streak, longest_streak")
      .eq("user_id", userId)
      .order("longest_streak", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleApiError(error, "fetching streak records");
  }
};
