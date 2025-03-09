import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { getAuthenticatedUser, handleApiError } from '@/lib/api/apiUtils';
import { Goal, CreateGoalData, KeyResult } from '@/lib/goalTypes';

// Fetch all goals with their key results
export async function fetchGoals(): Promise<Goal[]> {
  try {
    const userId = await getAuthenticatedUser();
    
    // Fetch goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (goalsError) throw new Error(goalsError.message);
    
    // For each goal, fetch its key results
    const goalsWithKeyResults = await Promise.all(
      goalsData.map(async (goal) => {
        const { data: keyResults, error: keyResultsError } = await supabase
          .from('key_results')
          .select('*')
          .eq('goal_id', goal.id)
          .order('created_at', { ascending: true });
          
        if (keyResultsError) throw new Error(keyResultsError.message);
        
        return {
          ...goal,
          key_results: keyResults || []
        };
      })
    );
    
    return goalsWithKeyResults;
  } catch (err) {
    return handleApiError(err, 'fetching goals');
  }
}

// Create a new goal with its key results
export async function createGoal(goalData: CreateGoalData): Promise<{ success: boolean; goalId?: string }> {
  try {
    const userId = await getAuthenticatedUser();
    
    // Create the goal
    const { data: newGoal, error: goalError } = await supabase
      .from('goals')
      .insert([
        { 
          user_id: userId, 
          name: goalData.name, 
          objective: goalData.objective, 
          start_date: goalData.start_date, 
          end_date: goalData.end_date,
          progress: 0
        }
      ])
      .select()
      .single();
    
    if (goalError) throw new Error(goalError.message);
    
    // Create key results for the goal
    if (goalData.key_results.length > 0) {
      const keyResultsToInsert = goalData.key_results.map(kr => ({
        goal_id: newGoal.id,
        description: kr.description,
        target_value: kr.target_value,
        current_value: kr.current_value || 0,
        habit_id: kr.habit_id
      }));
      
      const { error: krError } = await supabase
        .from('key_results')
        .insert(keyResultsToInsert);
      
      if (krError) throw new Error(krError.message);
    }
    
    return { success: true, goalId: newGoal.id };
  } catch (err) {
    console.error('Error creating goal:', err);
    toast({
      title: 'Error creating goal',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}

// Update a key result's current value and recalculate goal progress
export async function updateKeyResult(keyResultId: string, currentValue: number): Promise<{ success: boolean }> {
  try {
    // Update the key result
    const { error: krError } = await supabase
      .from('key_results')
      .update({ current_value: currentValue, updated_at: new Date().toISOString() })
      .eq('id', keyResultId);
    
    if (krError) throw new Error(krError.message);
    
    // Get the goal ID for the key result
    const { data: keyResult, error: getKrError } = await supabase
      .from('key_results')
      .select('goal_id, target_value')
      .eq('id', keyResultId)
      .single();
    
    if (getKrError) throw new Error(getKrError.message);
    
    // Get all key results for the goal to calculate progress
    const { data: allKeyResults, error: allKrError } = await supabase
      .from('key_results')
      .select('target_value, current_value')
      .eq('goal_id', keyResult.goal_id);
    
    if (allKrError) throw new Error(allKrError.message);
    
    // Calculate progress as percentage of all key results
    const totalTargetValue = allKeyResults.reduce((sum, kr) => sum + parseFloat(kr.target_value), 0);
    const totalCurrentValue = allKeyResults.reduce((sum, kr) => sum + parseFloat(kr.current_value), 0);
    
    const progress = totalTargetValue > 0 
      ? Math.min(100, Math.round((totalCurrentValue / totalTargetValue) * 100)) 
      : 0;
    
    // Update the goal's progress
    const { error: goalError } = await supabase
      .from('goals')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('id', keyResult.goal_id);
    
    if (goalError) throw new Error(goalError.message);
    
    return { success: true };
  } catch (err) {
    console.error('Error updating key result:', err);
    toast({
      title: 'Error updating key result',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}

// Delete a goal and all its key results
export async function deleteGoal(goalId: string): Promise<{ success: boolean }> {
  try {
    // First delete all key results associated with the goal
    const { error: krError } = await supabase
      .from('key_results')
      .delete()
      .eq('goal_id', goalId);
    
    if (krError) throw new Error(krError.message);
    
    // Then delete the goal itself
    const { error: goalError } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);
    
    if (goalError) throw new Error(goalError.message);
    
    return { success: true };
  } catch (err) {
    console.error('Error deleting goal:', err);
    toast({
      title: 'Error deleting goal',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}

// Update goal details
export async function updateGoal(
  goalId: string, 
  updates: { name?: string; objective?: string; start_date?: string; end_date?: string }
): Promise<{ success: boolean }> {
  try {
    const { error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', goalId);
    
    if (error) throw new Error(error.message);
    
    return { success: true };
  } catch (err) {
    console.error('Error updating goal:', err);
    toast({
      title: 'Error updating goal',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}

// Mark a goal as complete (100% progress)
export async function completeGoal(goalId: string): Promise<{ success: boolean }> {
  try {
    // Update the goal's progress to 100%
    const { error } = await supabase
      .from('goals')
      .update({ 
        progress: 100,
        updated_at: new Date().toISOString() 
      })
      .eq('id', goalId);
    
    if (error) throw new Error(error.message);
    
    // Get all key results for this goal
    const { data: keyResults, error: krError } = await supabase
      .from('key_results')
      .select('id, target_value')
      .eq('goal_id', goalId);
    
    if (krError) throw new Error(krError.message);
    
    // Update all key results to be at their target values
    if (keyResults && keyResults.length > 0) {
      for (const kr of keyResults) {
        const { error: updateError } = await supabase
          .from('key_results')
          .update({ 
            current_value: kr.target_value,
            updated_at: new Date().toISOString() 
          })
          .eq('id', kr.id);
        
        if (updateError) throw new Error(updateError.message);
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error completing goal:', err);
    toast({
      title: 'Error completing goal',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}
