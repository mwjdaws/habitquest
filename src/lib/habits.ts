
import { supabase } from "./supabase";
import { handleError, formatErrorMessage } from "./error-utils";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string[];
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_date: string;
  user_id: string;
  created_at: string;
};

export const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

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

// Helper functions that don't require error handling
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

export const getDayName = (date: Date): string => {
  return weekdays[date.getDay()];
};

export const shouldShowHabitForDay = (habit: Habit, dayName: string): boolean => {
  return habit.frequency.length === 0 || habit.frequency.includes(dayName.toLowerCase());
};
