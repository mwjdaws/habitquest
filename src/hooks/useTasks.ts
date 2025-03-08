
import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/lib/taskTypes';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } from '@/lib/api/taskAPI';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tasks'));
      toast({
        title: "Error loading tasks",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Load tasks on mount and when user changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Add a new task
  const addTask = async (newTaskData: CreateTaskData) => {
    try {
      const newTask = await createTask(newTaskData);
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: "Task created",
        description: "Your new task has been added",
      });
      return newTask;
    } catch (err) {
      toast({
        title: "Failed to create task",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Update a task
  const editTask = async (taskId: string, taskUpdates: UpdateTaskData) => {
    try {
      const updatedTask = await updateTask(taskId, taskUpdates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast({
        title: "Task updated",
        description: "Your task has been updated",
      });
      return updatedTask;
    } catch (err) {
      toast({
        title: "Failed to update task",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Remove a task
  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Your task has been removed",
      });
    } catch (err) {
      toast({
        title: "Failed to delete task",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  // Toggle completion status
  const toggleCompletion = async (taskId: string, currentStatus: string) => {
    try {
      const updatedTask = await toggleTaskCompletion(taskId, currentStatus);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      const statusMessage = updatedTask.status === 'completed' ? "completed" : "marked as pending";
      toast({
        title: `Task ${statusMessage}`,
        description: `Task has been ${statusMessage}`,
      });
      
      return updatedTask;
    } catch (err) {
      toast({
        title: "Failed to update task status",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    toggleCompletion
  };
}
