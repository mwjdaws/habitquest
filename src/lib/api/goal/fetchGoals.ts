
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@/lib/api/apiUtils';
import { Goal } from '@/lib/goalTypes';

// Fetch all goals with their key results
export async function fetchGoals(): Promise<Goal[]> {
  try {
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
