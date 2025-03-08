
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
