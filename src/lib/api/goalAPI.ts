
// This file now just re-exports all the individual goal API functions
// for backward compatibility
export {
  fetchGoals,
  createGoal,
  updateKeyResult,
  deleteGoal,
  updateGoal,
  completeGoal
} from './goal';
