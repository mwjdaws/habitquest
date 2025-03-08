
import { supabase } from '../supabase';
import { CreateTaskData, Task, UpdateTaskData } from '../taskTypes';
import { getAuthenticatedUser, handleApiError } from './apiUtils';

/**
 * Fetches all tasks for the current user
 */
export async function fetchTasks(): Promise<Task[]> {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as Task[];
  } catch (error) {
    return handleApiError(error, 'fetching tasks');
  }
}

/**
 * Creates a new task for the current user
 */
export async function createTask(taskData: CreateTaskData): Promise<Task> {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...taskData, user_id: userId })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Task;
  } catch (error) {
    return handleApiError(error, 'creating task');
  }
}

/**
 * Updates an existing task
 */
export async function updateTask(taskId: string, updates: UpdateTaskData): Promise<Task> {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', userId) // Extra security check
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Task;
  } catch (error) {
    return handleApiError(error, 'updating task');
  }
}

/**
 * Deletes a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const userId = await getAuthenticatedUser();
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId); // Extra security check
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'deleting task');
  }
}

/**
 * Toggles task completion status
 */
export async function toggleTaskCompletion(taskId: string, currentStatus: string): Promise<Task> {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  return updateTask(taskId, { status: newStatus as 'pending' | 'completed' });
}

/**
 * Fetch tasks linked to a specific habit
 */
export async function fetchTasksByHabit(habitId: string): Promise<Task[]> {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('habit_id', habitId)
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    return data as Task[];
  } catch (error) {
    return handleApiError(error, 'fetching habit tasks');
  }
}
