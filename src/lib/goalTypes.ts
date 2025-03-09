
// Types for the Goals feature
export type KeyResult = {
  id?: string;
  description: string;
  target_value: number;
  current_value: number;
  habit_id: string | null;
  temp_id?: string; // Used for managing unsaved key results in UI
};

export type Goal = {
  id: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
  key_results?: KeyResult[];
};

export type CreateGoalData = {
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  key_results: Omit<KeyResult, 'id'>[];
};
