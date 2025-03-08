
import { supabase } from "../supabase";
import { HabitCompletion } from "../habitTypes";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";

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
    
    const newStreak = (habit.current_streak || 0) + 1;
    const newLongestStreak = Math.max(newStreak, habit.longest_streak || 0);
    
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
    console.error("Error updating streak on completion:", error);
    // We'll log the error but not throw it to avoid breaking the main completion flow
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
    if ((habit.current_streak || 0) > 0) {
      const { error } = await supabase
        .from("habits")
        .update({ 
          current_streak: (habit.current_streak || 0) - 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", habitId)
        .eq("user_id", userId);
      
      if (error) throw error;
    }
    
  } catch (error) {
    console.error("Error updating streak on uncompletion:", error);
    // We'll log the error but not throw it to avoid breaking the main completion flow
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
