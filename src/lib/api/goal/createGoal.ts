
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { getAuthenticatedUser } from '@/lib/api/apiUtils';
import { CreateGoalData } from '@/lib/goalTypes';

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
