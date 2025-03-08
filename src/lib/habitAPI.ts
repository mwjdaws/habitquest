
import { supabase } from "./supabase";
import { Habit, HabitCompletion, HabitFailure } from "./habitTypes";
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
 * Base function to handle API errors consistently
 */
const handleApiError = (error: unknown, actionName: string): never => {
  console.error(`Error ${actionName}:`, error);
  throw new Error(formatErrorMessage(error));
};

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
        longest_streak: 0
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
    return handleApiError(error, "deleting habit");
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
    return handleApiError(error, "fetching completions");
  }
};

/**
 * Toggles the completion status of a habit for a specific date
 * and updates streak information
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
      
      // Update the streak (decrement)
      await updateStreakOnUncompletion(habitId, userId);
      
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
      
      // Update the streak (increment)
      await updateStreakOnCompletion(habitId, userId);
    }
    
  } catch (error) {
    return handleApiError(error, "toggling habit completion");
  }
};

/**
 * Updates streak on habit completion
 */
const updateStreakOnCompletion = async (habitId: string, userId: string) => {
  try {
    // Get the current habit data
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("current_streak, longest_streak")
      .eq("id", habitId)
      .eq("user_id", userId)
      .single();
    
    if (habitError) throw habitError;
    
    if (!habit) return;
    
    const newStreak = habit.current_streak + 1;
    const newLongestStreak = Math.max(newStreak, habit.longest_streak);
    
    // Update the streak
    const { error } = await supabase
      .from("habits")
      .update({ 
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        updated_at: new Date().toISOString()
      })
      .eq("id", habitId)
      .eq("user_id", userId);
    
    if (error) throw error;
    
  } catch (error) {
    return handleApiError(error, "updating streak on completion");
  }
};

/**
 * Updates streak on habit uncompletion
 */
const updateStreakOnUncompletion = async (habitId: string, userId: string) => {
  try {
    // Get the current habit data
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("current_streak")
      .eq("id", habitId)
      .eq("user_id", userId)
      .single();
    
    if (habitError) throw habitError;
    
    if (!habit) return;
    
    // Only decrease if the streak is greater than 0
    if (habit.current_streak > 0) {
      const { error } = await supabase
        .from("habits")
        .update({ 
          current_streak: habit.current_streak - 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", habitId)
        .eq("user_id", userId);
      
      if (error) throw error;
    }
    
  } catch (error) {
    return handleApiError(error, "updating streak on uncompletion");
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
    
  } catch (error) {
    return handleApiError(error, "logging habit failure");
  }
};

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
