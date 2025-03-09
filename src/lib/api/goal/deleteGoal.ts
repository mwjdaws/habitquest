
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { getAuthenticatedUser } from '@/lib/api/apiUtils';

// Delete a goal and all its key results
export async function deleteGoal(goalId: string): Promise<{ success: boolean }> {
  console.log(`Starting deletion process for goal ID: ${goalId}`);
  try {
    const userId = await getAuthenticatedUser();
    console.log(`Authenticated user ID: ${userId}`);

    // First delete all key results associated with the goal
    console.log(`Step 1: Deleting key_results for goal ID: ${goalId}`);
    const { error: krError } = await supabase
      .from('key_results')
      .delete()
      .eq('goal_id', goalId);
    
    if (krError) {
      console.error(`Error deleting key_results: ${krError.message}`);
      throw krError;
    }
    console.log("Key results deleted successfully");
    
    // Add a small delay to ensure all related records are processed by the database
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Then delete the goal itself
    console.log(`Step 2: Deleting goal ID: ${goalId}`);
    const { error: goalError } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);
    
    if (goalError) {
      console.error(`Error deleting goal: ${goalError.message}`);
      throw goalError;
    }
    
    console.log("Goal deleted successfully");
    
    // Add a small delay before returning to ensure UI has time to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
