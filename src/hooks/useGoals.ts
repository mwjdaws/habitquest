
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { getAuthenticatedUser } from '@/lib/api/apiUtils';

export type KeyResult = {
  id?: string;
  description: string;
  target_value: number;
  current_value: number;
  habit_id: string | null;
  temp_id?: string; // Used for managing unsaved key results in UI
};

export type Goal = {
  id: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
  key_results?: KeyResult[];
};

export type CreateGoalData = {
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  key_results: Omit<KeyResult, 'id'>[];
};

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoals = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
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
      
      setGoals(goalsWithKeyResults);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const createGoal = async (goalData: CreateGoalData): Promise<{ success: boolean; goalId?: string }> => {
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
      
      // Refresh goals data
      await fetchGoals(false);
      
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
  };

  const updateKeyResult = async (keyResultId: string, currentValue: number) => {
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
      
      // Refresh goals data
      await fetchGoals(false);
      
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
  };

  // Load goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    refreshGoals: () => fetchGoals(),
    createGoal,
    updateKeyResult
  };
}
