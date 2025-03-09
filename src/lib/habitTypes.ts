export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string[];
  color: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  current_streak: number;
  longest_streak: number;
  archived: boolean;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_date: string;
  user_id: string;
  created_at: string;
};

export type HabitFailure = {
  id: string;
  habit_id: string;
  user_id: string;
  failure_date: string;
  reason: string;
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

// Frequency types for habit creation
export type FrequencyType = "daily" | "weekly" | "custom";

// Default categories
export const defaultCategories = [
  "General",
  "Health",
  "Fitness",
  "Productivity",
  "Learning",
  "Finance",
  "Social",
  "Other"
];

// Common failure reasons
export const commonFailureReasons = [
  "Forgot",
  "Too busy",
  "Not feeling well",
  "Lost motivation",
  "Changed plans",
  "Other"
];
