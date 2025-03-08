
import { supabase } from "./supabase";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string[];
  color: string;
  created_at: string;
  updated_at: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_date: string;
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

export const fetchHabits = async (): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }

  return data || [];
};

export const createHabit = async (habit: Omit<Habit, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("habits").insert(habit).select().single();

  if (error) {
    console.error("Error creating habit:", error);
    throw error;
  }

  return data;
};

export const updateHabit = async (id: string, habit: Partial<Omit<Habit, "id" | "created_at" | "updated_at">>) => {
  const { data, error } = await supabase
    .from("habits")
    .update({ ...habit, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating habit:", error);
    throw error;
  }

  return data;
};

export const deleteHabit = async (id: string) => {
  const { error } = await supabase.from("habits").delete().eq("id", id);

  if (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};

export const getCompletionsForDate = async (date: string): Promise<HabitCompletion[]> => {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("completed_date", date);

  if (error) {
    console.error("Error fetching completions:", error);
    throw error;
  }

  return data || [];
};

export const toggleHabitCompletion = async (habitId: string, date: string, isCompleted: boolean) => {
  if (isCompleted) {
    // Delete the completion if it exists
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("completed_date", date);

    if (error) {
      console.error("Error removing habit completion:", error);
      throw error;
    }
  } else {
    // Add a completion
    const { error } = await supabase.from("habit_completions").insert({
      habit_id: habitId,
      completed_date: date,
    });

    if (error) {
      console.error("Error adding habit completion:", error);
      throw error;
    }
  }
};

export const getHabitStats = async (habitId: string, days: number) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("habit_id", habitId)
    .gte("completed_date", startDate.toISOString().split("T")[0])
    .lte("completed_date", endDate.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching habit stats:", error);
    throw error;
  }

  return data || [];
};

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

