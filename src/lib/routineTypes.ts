
export type Routine = {
  id: string;
  name: string;
  description: string | null;
  time_of_day: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type RoutineHabit = {
  id: string;
  routine_id: string;
  habit_id: string;
  position: number;
  created_at: string;
};

export type RoutineWithHabits = Routine & {
  habits: string[]; // Array of habit IDs
};
