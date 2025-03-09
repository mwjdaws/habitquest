
import { useMemo, useRef } from 'react';
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

// Cached map to store previously calculated values across renders
const statusCache = new WeakMap();

/**
 * Hook that returns memoized status values for a habit with optimized calculations
 * and caching to prevent expensive recalculations
 */
export function useHabitStatus(
  habit: Habit,
  completions: HabitCompletion[],
  failures: HabitFailure[]
) {
  // Use a ref to track render count for this hook instance
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  
  // Calculate a cache key based on completion and failure IDs
  const cacheKeyRef = useRef('');
  
  return useMemo(() => {
    // Performance optimization: Immediately check cache for result with same inputs
    const cacheKey = `${habit.id}:${completions.length}:${failures.length}`;
    
    // If we have the same completion/failure arrays and habit since last render, use cached result
    if (cacheKey === cacheKeyRef.current && statusCache.has(habit)) {
      return statusCache.get(habit);
    }
    
    cacheKeyRef.current = cacheKey;
    
    // Use specialized data structures for O(1) lookups
    const completionIds = new Set(completions.map(c => c.habit_id));
    const failureMap = new Map(failures.map(f => [f.habit_id, f]));
    
    const isCompleted = completionIds.has(habit.id);
    const isFailed = failureMap.has(habit.id);
    const failureReason = isFailed ? failureMap.get(habit.id)?.reason || "" : "";
    
    // Optimize frequently used CSS classes by pre-computing them once
    const bgColorClass = isCompleted 
      ? "bg-green-50 border-green-200" 
      : isFailed 
        ? "bg-red-50 border-red-200" 
        : "bg-background";
    
    // Create result object and store in the cache
    const result = { 
      isCompleted, 
      isFailed, 
      failureReason,
      bgColorClass
    };
    
    // Cache the result using the habit instance as a key
    statusCache.set(habit, result);
    
    return result;
  }, [habit, completions, failures]);
}

/**
 * Optimized function to determine if HabitItem needs to re-render
 * with additional optimizations for array comparison
 */
export function habitItemPropsAreEqual(prevProps: any, nextProps: any) {
  // Fast identity checks first
  if (prevProps.habit !== nextProps.habit) return false;
  
  // For handlers, just check reference equality since we should be using useCallback
  if (
    prevProps.onToggleCompletion !== nextProps.onToggleCompletion ||
    prevProps.onLogFailure !== nextProps.onLogFailure ||
    prevProps.onUndoFailure !== nextProps.onUndoFailure
  ) return false;
  
  // If the arrays are the same reference, no re-render needed
  if (prevProps.completions === nextProps.completions && 
      prevProps.failures === nextProps.failures) {
    return true;
  }
  
  // Fast length check before doing more expensive operations
  if (prevProps.completions.length !== nextProps.completions.length ||
      prevProps.failures.length !== nextProps.failures.length) {
    return false;
  }
  
  // Only do the more expensive checks if needed
  // Check only if the habit's completion status changed
  const habitId = prevProps.habit.id;
  const prevCompleted = prevProps.completions.some((c: any) => c.habit_id === habitId);
  const nextCompleted = nextProps.completions.some((c: any) => c.habit_id === habitId);
  
  if (prevCompleted !== nextCompleted) return false;
  
  // Check only if the habit's failure status changed
  const prevFailure = prevProps.failures.find((f: any) => f.habit_id === habitId);
  const nextFailure = nextProps.failures.find((f: any) => f.habit_id === habitId);
  
  if (!prevFailure && !nextFailure) return true;
  if ((!prevFailure && nextFailure) || (prevFailure && !nextFailure)) return false;
  
  return prevFailure.reason === nextFailure.reason;
}
