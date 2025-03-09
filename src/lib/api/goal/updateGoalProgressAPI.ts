
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Update the progress of a goal
export async function updateGoalProgress(
  goalId: string,
  progress: number
): Promise<{ success: boolean }> {
  try {
    const { error } = await supabase
      .from('goals')
      .update({ 
        progress, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', goalId);
    
    if (error) throw new Error(error.message);
    
    return { success: true };
  } catch (err) {
    console.error('Error updating goal progress:', err);
    toast({
      title: 'Error updating goal progress',
      description: err instanceof Error ? err.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return { success: false };
  }
}
