
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
