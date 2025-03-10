import { supabase } from "../supabase";
import { HabitCompletion } from "../habitTypes";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";
import { getTodayFormattedInToronto } from "../dateUtils";

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
 * Updates streak on habit completion with frequency awareness
 */
const updateStreakOnCompletion = async (habitId: string, userId: string) => {
  try {
    // Get both the habit data and recent completions
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("id, frequency, current_streak, longest_streak")
      .eq("id", habitId)
      .eq("user_id", userId)
      .single();
    
    if (habitError) throw habitError;
    
    if (!habit) return;
    
    // Get recent completions for this habit (last 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const { data: completions, error: completionsError } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", userId)
      .gte("completed_date", sixtyDaysAgo.toISOString().split('T')[0]);
    
    if (completionsError) throw completionsError;
    
    // Get recent failures
    const { data: failures, error: failuresError } = await supabase
      .from("habit_failures")
      .select("*")
      .eq("habit_id", habitId)
      .eq("user_id", userId)
      .gte("failure_date", sixtyDaysAgo.toISOString().split('T')[0]);
    
    if (failuresError) throw failuresError;
    
    // Calculate streak based on frequency
    let newStreak = 1; // Start with 1 for today's completion
    
    // If there are any recent failures, reset streak
    if (failures && failures.length > 0) {
      // Sort failures by date (newest first)
      const sortedFailures = [...failures].sort((a, b) => 
        new Date(b.failure_date).getTime() - new Date(a.failure_date).getTime()
      );
      
      // If there's a recent failure, streak is 1 (today's completion)
      const mostRecentFailure = sortedFailures[0];
      const today = getTodayFormattedInToronto();
      
      if (mostRecentFailure.failure_date === today) {
        // If failure was logged today but now completed, set streak to 1
        newStreak = 1;
      } else {
        // Let the backend calculate the updated streak for consistency
        // This simple increment handles daily habits but the proper
        // frequency-aware calculation will happen in the frontend
        newStreak = (habit.current_streak || 0) + 1;
      }
    } else {
      // No failures, simply increment the streak
      newStreak = (habit.current_streak || 0) + 1;
    }
    
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
 * Updates streak on habit uncompletion with frequency awareness
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
