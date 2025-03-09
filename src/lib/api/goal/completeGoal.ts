
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
