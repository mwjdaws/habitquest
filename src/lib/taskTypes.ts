
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  due_date: string | null; // ISO date string
  status: TaskStatus;
  habit_id: string | null;
  tag: string | null; // New field for task tag
  created_at: string; // ISO datetime string
}

export interface CreateTaskData {
  name: string;
  description?: string;
  due_date?: string; // ISO date string
  habit_id?: string;
  tag?: string; // New field for task tag
}

export interface UpdateTaskData {
  name?: string;
  description?: string | null;
  due_date?: string | null; // ISO date string
  status?: TaskStatus;
  habit_id?: string | null;
  tag?: string | null; // New field for task tag
}
