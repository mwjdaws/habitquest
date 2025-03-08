
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchHabits, 
  getCompletionsForDate, 
  getFailuresForDate,
  toggleHabitCompletion, 
  logHabitFailure,
  getTodayFormatted, 
  getDayName, 
  shouldShowHabitForDay
} from "@/lib/habits";
import { Habit } from "@/lib/habitTypes";

export function useHabitTracking(onHabitChange?: () => void) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState([]);
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dataRefreshTimerRef = useRef<number | null>(null);
  const initialLoadAttemptedRef = useRef(false);
  const isLoadingRef = useRef(true);
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  // Function to load data with optimized error handling
  const loadData = useCallback(async (showLoading = true) => {
    if (!user) return;
    
    // Track loading state
    if (showLoading) {
      isLoadingRef.current = true;
      setLoading(true);
    }
    setError(null);
    
    try {
      // Clear any existing timer
      if (dataRefreshTimerRef.current) {
        window.clearTimeout(dataRefreshTimerRef.current);
        dataRefreshTimerRef.current = null;
      }
      
      console.log('Fetching habit data...');
      
      // Use Promise.allSettled to handle partial failures
      const results = await Promise.allSettled([
        fetchHabits(),
        getCompletionsForDate(today),
        getFailuresForDate(today)
      ]);
      
      // Process results safely - prevent undefined results
      const habitsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const completionsData = results[1].status === 'fulfilled' ? results[1].value : [];
      const failuresData = results[2].status === 'fulfilled' ? results[2].value : [];
      
      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to fetch data for request ${index}:`, result.reason);
        }
      });
      
      // Only update state for successful fetches
      console.log(`Loaded ${habitsData.length} habits, ${completionsData.length} completions, ${failuresData.length} failures`);
      
      setHabits(habitsData || []);
      setCompletions(completionsData || []);
      setFailures(failuresData || []);
      
      // Notify parent components that data has changed
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      console.error("Error loading habit data:", error);
      setError("Failed to load habit data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load habit data. Please refresh.",
        variant: "destructive",
      });
    } finally {
      // Add a small delay to prevent flashing of loading state
      dataRefreshTimerRef.current = window.setTimeout(() => {
        isLoadingRef.current = false;
        setLoading(false);
      }, 300);
    }
  }, [user, today, onHabitChange]);

  // Initial load
  useEffect(() => {
    if (user && !initialLoadAttemptedRef.current) {
      initialLoadAttemptedRef.current = true;
      
      // Small delay before the initial load to ensure auth is fully complete
      const initialLoadTimer = setTimeout(() => {
        loadData(true);
      }, 100);
      
      return () => {
        clearTimeout(initialLoadTimer);
        if (dataRefreshTimerRef.current) {
          window.clearTimeout(dataRefreshTimerRef.current);
          dataRefreshTimerRef.current = null;
        }
      };
    }
  }, [user, loadData]);

  // Reload data when date changes
  useEffect(() => {
    if (initialLoadAttemptedRef.current && user) {
      loadData(true);
    }
  }, [today, user, loadData]);

  // Public method to refresh data without showing loading state
  const refreshData = useCallback((showLoading = false) => {
    return loadData(showLoading);
  }, [loadData]);

  // Handle toggling habit completion with optimistic updates
  const handleToggleCompletion = async (habitId: string) => {
    if (!user) return;
    
    try {
      const isCompleted = completions.some(c => c.habit_id === habitId);
      
      // Optimistic update - update UI immediately
      if (isCompleted) {
        setCompletions(prev => prev.filter(c => c.habit_id !== habitId));
      } else {
        const newCompletion = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          created_at: new Date().toISOString()
        };
        setCompletions(prev => [...prev, newCompletion]);
        
        // Remove any failure for this habit on this day
        setFailures(prev => prev.filter(f => f.habit_id !== habitId));
      }
      
      // Send update to server
      await toggleHabitCompletion(habitId, today, isCompleted);
      
      // Refresh habit data to get updated streak
      refreshData(false);
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      
      // Rollback optimistic update
      refreshData(false);
      
      toast({
        title: "Error",
        description: "Failed to update habit status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle logging habit failure with optimistic updates
  const handleLogFailure = async (habitId: string, reason: string) => {
    if (!user) return;
    
    try {
      // Optimistic update
      const newFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: user.id,
        failure_date: today,
        reason,
        created_at: new Date().toISOString()
      };
      
      // Remove any completions for this habit on this day
      setCompletions(prev => prev.filter(c => c.habit_id !== habitId));
      
      // Add the failure or replace existing one
      setFailures(prev => [...prev.filter(f => f.habit_id !== habitId), newFailure]);
      
      // Send to server
      await logHabitFailure(habitId, today, reason);
      
      // Refresh to update streaks
      refreshData(false);
      
      toast({
        title: "Reason logged",
        description: "Thanks for your honesty. You'll do better tomorrow!",
      });
    } catch (error) {
      console.error("Error logging failure:", error);
      
      // Rollback optimistic update
      refreshData(false);
      
      toast({
        title: "Error",
        description: "Failed to log failure reason. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter habits for today
  const todaysHabits = habits.filter(habit => shouldShowHabitForDay(habit, todayName));
  console.log(`Today (${todayName}): Filtered ${habits.length} habits to ${todaysHabits.length} for today`);
  
  // Calculate progress
  const completedCount = todaysHabits.length > 0 
    ? todaysHabits.filter(habit => completions.some(c => c.habit_id === habit.id)).length 
    : 0;
  const progress = todaysHabits.length > 0 
    ? Math.round((completedCount / todaysHabits.length) * 100) 
    : 0;

  return {
    habits: todaysHabits,
    completions,
    failures,
    loading: isLoadingRef.current, // Use ref for more stable loading state
    error,
    progress,
    completedCount,
    totalCount: todaysHabits.length,
    handleToggleCompletion,
    handleLogFailure,
    refreshData,
  };
}
