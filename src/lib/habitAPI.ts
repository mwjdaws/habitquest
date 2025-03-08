
import { supabase } from "./supabase";
import { Habit, HabitCompletion } from "./habitTypes";
import { formatErrorMessage } from "./error-utils";

/**
 * Validates that the user is authenticated
 * @returns User ID if authenticated, throws error if not
 */
async function getAuthenticatedUser(): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error("Authentication required");
  }
  return session.session.user.id;
}

/**
 * Fetches all habits for the authenticated user
 */
export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Creates a new habit for the authenticated user
 */
export const createHabit = async (habit: Omit<Habit, "id" | "created_at" | "updated_at" | "user_id">) => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habits")
      .insert({
        ...habit,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error creating habit:", error);
    throw new Error(formatErrorMessage(error));
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
    console.error("Error updating habit:", error);
    throw new Error(formatErrorMessage(error));
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
    
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Gets habit completions for a specific date
 */
export const getCompletionsForDate = async (date: string): Promise<HabitCompletion[]> => {
  try {
    const userId = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("completed_date", date)
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching completions:", error);
    throw new Error(formatErrorMessage(error));
  }
};

/**
 * Toggles the completion status of a habit for a specific date
 */
export const toggleHabitCompletion = async (habitId: string, date: string, isCompleted: boolean) => {
  try {
    const userId = await getAuthenticatedUser();

    if (isCompleted) {
      // Delete the completion if it exists
      const { error } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habitId)
        .eq("completed_date", date)
        .eq("user_id", userId);

      if (error) throw error;
      
    } else {
      // Add a completion
      const { error } = await supabase
        .from("habit_completions")
        .insert({
          habit_id: habitId,
          completed_date: date,
          user_id: userId
        });

      if (error) throw error;
    }
    
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw new Error(formatErrorMessage(error));
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
    console.error("Error fetching habit stats:", error);
    throw new Error(formatErrorMessage(error));
  }
};
