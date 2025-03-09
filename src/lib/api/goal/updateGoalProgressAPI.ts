
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

/**
 * Updates the progress of a goal with better error handling and data validation
 */
export async function updateGoalProgress(
  goalId: string,
  progress: number
): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate progress value to ensure it's within range
    const validatedProgress = Math.max(0, Math.min(100, progress));
    
    console.log(`Updating goal ${goalId} progress to ${validatedProgress}%`);
    
    const { data, error } = await supabase
      .from('goals')
      .update({ 
        progress: validatedProgress, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', goalId)
      .select('name')
      .single();
    
    if (error) throw new Error(error.message);
    
    // Provide a more informative success response
    return { 
      success: true,
      message: data?.name ? `Updated progress for "${data.name}"` : "Goal progress updated"
    };
  } catch (err) {
    console.error('Error updating goal progress:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    
    toast({
      title: 'Error updating goal progress',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return { 
      success: false,
      message: errorMessage
    };
  }
}
