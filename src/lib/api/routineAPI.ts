
import { supabase } from "@/lib/supabase";
import { Routine, RoutineHabit } from "@/lib/routineTypes";
import { getTodayFormatted } from "@/lib/habitUtils";
import { formatErrorMessage } from "@/lib/error-utils";

/**
 * Fetch all routines for the current user
 */
export async function fetchRoutines(): Promise<Routine[]> {
  try {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching routines:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Fetch a specific routine with its associated habits
 */
export async function fetchRoutineWithHabits(routineId: string): Promise<{routine: Routine, habitIds: string[]}> {
  try {
    // Fetch the routine
    const { data: routine, error: routineError } = await supabase
      .from('routines')
      .select('*')
      .eq('id', routineId)
      .single();

    if (routineError) throw routineError;

    // Fetch the associated habits
    const { data: routineHabits, error: habitsError } = await supabase
      .from('routine_habits')
      .select('habit_id')
      .eq('routine_id', routineId)
      .order('position', { ascending: true });

    if (habitsError) throw habitsError;

    return {
      routine,
      habitIds: routineHabits.map(item => item.habit_id)
    };
  } catch (error) {
    console.error('Error fetching routine with habits:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Create a new routine
 */
export async function createRoutine(routine: Omit<Routine, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Routine> {
  try {
    const { data, error } = await supabase
      .from('routines')
      .insert(routine)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Update an existing routine
 */
export async function updateRoutine(routineId: string, updates: Partial<Routine>): Promise<Routine> {
  try {
    const { data, error } = await supabase
      .from('routines')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', routineId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Delete a routine
 */
export async function deleteRoutine(routineId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('routines')
      .delete()
      .eq('id', routineId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Add a habit to a routine
 */
export async function addHabitToRoutine(routineId: string, habitId: string, position: number = 0): Promise<RoutineHabit> {
  try {
    const { data, error } = await supabase
      .from('routine_habits')
      .insert({
        routine_id: routineId,
        habit_id: habitId,
        position
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding habit to routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Remove a habit from a routine
 */
export async function removeHabitFromRoutine(routineId: string, habitId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('routine_habits')
      .delete()
      .eq('routine_id', routineId)
      .eq('habit_id', habitId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing habit from routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Update the positions of habits in a routine
 */
export async function updateRoutineHabitPositions(items: {id: string, position: number}[]): Promise<void> {
  try {
    const updates = items.map(item => ({
      id: item.id,
      position: item.position
    }));

    const { error } = await supabase
      .from('routine_habits')
      .upsert(updates);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating routine habit positions:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Complete all habits in a routine
 */
export async function completeRoutine(routineId: string): Promise<string[]> {
  try {
    const today = getTodayFormatted();
    
    // Call the database function to complete all habits in the routine
    const { data, error } = await supabase
      .rpc('complete_routine', {
        p_routine_id: routineId,
        p_completed_date: today
      });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error completing routine:', error);
    throw new Error(formatErrorMessage(error));
  }
}
