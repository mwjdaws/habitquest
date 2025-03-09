
import { useState, useEffect, useCallback } from 'react';
import { Goal, KeyResult, CreateGoalData } from '@/lib/goalTypes';
import { fetchGoals, createGoal, updateKeyResult } from '@/lib/api/goalAPI';

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { Goal, KeyResult, CreateGoalData } from '@/lib/goalTypes';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshGoals = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      const goalsData = await fetchGoals();
      setGoals(goalsData);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const handleCreateGoal = useCallback(async (goalData: CreateGoalData) => {
    const result = await createGoal(goalData);
    
    if (result.success) {
      await refreshGoals(false);
    }
    
    return result;
  }, [refreshGoals]);

  const handleUpdateKeyResult = useCallback(async (keyResultId: string, currentValue: number) => {
    const result = await updateKeyResult(keyResultId, currentValue);
    
    if (result.success) {
      await refreshGoals(false);
    }
    
    return result;
  }, [refreshGoals]);

  // Load goals on component mount
  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  return {
    goals,
    loading,
    error,
    refreshGoals,
    createGoal: handleCreateGoal,
    updateKeyResult: handleUpdateKeyResult
  };
}
