
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
