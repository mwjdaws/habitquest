
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
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState([]);
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { user } = useAuth();
  const dataRefreshTimerRef = useRef<number | null>(null);
  const initialLoadAttemptedRef = useRef(false);
  const isLoadingRef = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  // Add debounce to prevent multiple rapid data loads
  const debouncedLoadData = useCallback((showLoading = true) => {
    // Prevent multiple rapid fetches - only fetch if it's been at least 3 seconds since last fetch
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000 && lastFetchTimeRef.current !== 0) {
      console.log('Debouncing data fetch - too soon since last fetch');
      return;
    }
    
    lastFetchTimeRef.current = now;
    
    // Clear any existing timer
    if (dataRefreshTimerRef.current) {
      window.clearTimeout(dataRefreshTimerRef.current);
      dataRefreshTimerRef.current = null;
    }
    
    // Set a small delay before actually loading data to debounce
    dataRefreshTimerRef.current = window.setTimeout(() => {
      loadData(showLoading);
    }, 300);
  }, []);

  // Function to apply frequency filtering to habits
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    if (!allHabits || !allHabits.length) return [];
    
    const filtered = allHabits.filter(habit => shouldShowHabitForDay(habit, todayName));
    console.log(`Today (${todayName}): Filtered ${allHabits.length} habits to ${filtered.length} for today`);
    return filtered;
  }, [todayName]);

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
      console.log('Fetching habit data...');
      
      // Use Promise.all to fetch data in parallel
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
      setFilteredHabits(filterHabitsForToday(habitsData || []));
      setCompletions(completionsData || []);
      setFailures(failuresData || []);
      setIsInitialized(true);
      
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
      }, 400);
    }
  }, [user, today, onHabitChange, filterHabitsForToday]);

  // Initial load
  useEffect(() => {
    if (user && !initialLoadAttemptedRef.current) {
      initialLoadAttemptedRef.current = true;
      
      // Small delay before the initial load to ensure auth is fully complete
      const initialLoadTimer = setTimeout(() => {
        debouncedLoadData(true);
      }, 400);
      
      return () => {
        clearTimeout(initialLoadTimer);
        if (dataRefreshTimerRef.current) {
          window.clearTimeout(dataRefreshTimerRef.current);
          dataRefreshTimerRef.current = null;
        }
      };
    }
  }, [user, debouncedLoadData]);

  // Reload data when date changes
  useEffect(() => {
    if (initialLoadAttemptedRef.current && user && isInitialized) {
      debouncedLoadData(true);
    }
  }, [today, user, debouncedLoadData, isInitialized]);

  // Public method to refresh data without showing loading state
  const refreshData = useCallback((showLoading = false) => {
    return debouncedLoadData(showLoading);
  }, [debouncedLoadData]);

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
      
      // Refresh habit data to get updated streak (but don't show loading state)
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
  
  // Calculate progress
  const completedCount = filteredHabits.length > 0 
    ? filteredHabits.filter(habit => completions.some(c => c.habit_id === habit.id)).length 
    : 0;
  const progress = filteredHabits.length > 0 
    ? Math.round((completedCount / filteredHabits.length) * 100) 
    : 0;

  return {
    habits: filteredHabits,
    completions,
    failures,
    loading: isLoadingRef.current, // Use ref for more stable loading state
    error,
    progress,
    completedCount,
    totalCount: filteredHabits.length,
    handleToggleCompletion,
    handleLogFailure,
    refreshData,
    isInitialized,
  };
}
