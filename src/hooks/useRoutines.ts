
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Routine, RoutineWithHabits } from '@/lib/routineTypes';
import {
  fetchRoutines,
  fetchRoutineWithHabits,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addHabitToRoutine,
  removeHabitFromRoutine,
  completeRoutine
} from '@/lib/api/routineAPI';
import { useAuth } from '@/contexts/AuthContext';

export function useRoutines() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutines = useCallback(async () => {
    if (!user) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchRoutines();
      setRoutines(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading routines');
      toast.error('Failed to load routines');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const getRoutineWithHabits = async (routineId: string): Promise<{routine: Routine, habitIds: string[]}> => {
    try {
      return await fetchRoutineWithHabits(routineId);
    } catch (err) {
      toast.error('Failed to load routine details');
      throw err;
    }
  };

  const addRoutine = async (routineData: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Routine> => {
    try {
      const newRoutine = await createRoutine(routineData);
      setRoutines(prev => [newRoutine, ...prev]);
      toast.success('Routine created successfully');
      return newRoutine;
    } catch (err) {
      toast.error('Failed to create routine');
      throw err;
    }
  };

  const editRoutine = async (routineId: string, updates: Partial<Routine>): Promise<void> => {
    try {
      const updated = await updateRoutine(routineId, updates);
      setRoutines(prev => prev.map(r => r.id === routineId ? updated : r));
      toast.success('Routine updated successfully');
    } catch (err) {
      toast.error('Failed to update routine');
      throw err;
    }
  };

  const removeRoutine = async (routineId: string): Promise<void> => {
    try {
      await deleteRoutine(routineId);
      setRoutines(prev => prev.filter(r => r.id !== routineId));
      toast.success('Routine deleted successfully');
    } catch (err) {
      toast.error('Failed to delete routine');
      throw err;
    }
  };

  const addHabitToRoutineHandler = async (routineId: string, habitId: string): Promise<void> => {
    try {
      await addHabitToRoutine(routineId, habitId);
      toast.success('Habit added to routine');
    } catch (err) {
      toast.error('Failed to add habit to routine');
      throw err;
    }
  };

  const removeHabitFromRoutineHandler = async (routineId: string, habitId: string): Promise<void> => {
    try {
      await removeHabitFromRoutine(routineId, habitId);
      toast.success('Habit removed from routine');
    } catch (err) {
      toast.error('Failed to remove habit from routine');
      throw err;
    }
  };

  const markRoutineComplete = async (routineId: string): Promise<string[]> => {
    try {
      const completedHabitIds = await completeRoutine(routineId);
      toast.success('Routine completed successfully');
      return completedHabitIds;
    } catch (err) {
      toast.error('Failed to complete routine');
      throw err;
    }
  };

  return {
    routines,
    loading,
    error,
    refresh: loadRoutines,
    getRoutineWithHabits,
    addRoutine,
    editRoutine,
    removeRoutine,
    addHabitToRoutine: addHabitToRoutineHandler,
    removeHabitFromRoutine: removeHabitFromRoutineHandler,
    completeRoutine: markRoutineComplete
  };
}
