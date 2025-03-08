
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
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);
  const initialLoadCompletedRef = useRef(false);
  const dataLoadTimerRef = useRef<number | null>(null);
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  // Create a dedicated function to filter habits for today
  const filterHabitsForToday = useCallback((allHabits: Habit[]) => {
    if (!allHabits || !allHabits.length) return [];
    
    return allHabits.filter(habit => {
      const shouldShow = shouldShowHabitForDay(habit, todayName);
      return shouldShow;
    });
  }, [todayName]);

  // Dramatically improved data loading with proper debouncing and error handling
  const loadData = useCallback(async (showLoading = true) => {
    if (!user || !isMountedRef.current) return;
    
    // Strict debouncing: Prevent rapid successive calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000) {
      console.log('Skipping data fetch - too soon since last fetch');
      return;
    }
    lastFetchTimeRef.current = now;
    
    // Track loading state
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {      
      console.log('Fetching habit data...');
      
      // Use Promise.all to fetch data in parallel for better performance
      const [habitsData, completionsData, failuresData] = await Promise.all([
        fetchHabits(),
        getCompletionsForDate(today),
        getFailuresForDate(today)
      ]);
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      const filtered = filterHabitsForToday(habitsData || []);
      console.log(`Loaded ${habitsData.length} habits, filtered to ${filtered.length} for today (${todayName})`);
      
      // Update all state at once to prevent multiple rerenders
      setHabits(habitsData || []);
      setFilteredHabits(filtered);
      setCompletions(completionsData || []);
      setFailures(failuresData || []);
      setIsInitialized(true);
      initialLoadCompletedRef.current = true;
      
      // Notify parent components that data has changed
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      console.error("Error loading habit data:", error);
      
      if (!isMountedRef.current) return;
      
      setError("Failed to load habit data. Please try again.");
      
      // Only show toast for user-initiated loads
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load habit data. Please refresh.",
          variant: "destructive",
        });
      }
    } finally {
      // Ensure loading state is cleared with slight delay to prevent flickering
      if (dataLoadTimerRef.current) {
        window.clearTimeout(dataLoadTimerRef.current);
      }
      
      dataLoadTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }, 300);
    }
  }, [user, today, todayName, onHabitChange, filterHabitsForToday]);

  // Improved debounce function that prevents rapid calls
  const debouncedLoadData = useCallback((showLoading = true) => {
    if (dataLoadTimerRef.current) {
      window.clearTimeout(dataLoadTimerRef.current);
    }
    
    dataLoadTimerRef.current = window.setTimeout(() => {
      loadData(showLoading);
    }, 300);
  }, [loadData]);

  // Only load data when component mounts and user is authenticated
  useEffect(() => {
    isMountedRef.current = true;
    
    if (user && !initialLoadCompletedRef.current) {
      // Small delay before initial load to ensure everything is ready
      dataLoadTimerRef.current = window.setTimeout(() => {
        loadData(true);
      }, 500);
    }
    
    // Set up sensible interval for periodic refreshes (every 5 minutes)
    const refreshInterval = window.setInterval(() => {
      if (user && initialLoadCompletedRef.current && isMountedRef.current) {
        loadData(false); // Silent refresh
      }
    }, 300000); // 5 minutes
    
    return () => {
      isMountedRef.current = false;
      
      if (dataLoadTimerRef.current) {
        window.clearTimeout(dataLoadTimerRef.current);
      }
      
      window.clearInterval(refreshInterval);
    };
  }, [user, loadData]);

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
      debouncedLoadData(false);
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      
      // Rollback optimistic update
      debouncedLoadData(false);
      
      toast({
        title: "Error",
        description: "Failed to update habit status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle logging habit failure
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
      debouncedLoadData(false);
      
      toast({
        title: "Reason logged",
        description: "Thanks for your honesty. You'll do better tomorrow!",
      });
    } catch (error) {
      console.error("Error logging failure:", error);
      
      // Rollback optimistic update
      debouncedLoadData(false);
      
      toast({
        title: "Error",
        description: "Failed to log failure reason. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Public method to refresh data
  const refreshData = useCallback((showLoading = false) => {
    debouncedLoadData(showLoading);
  }, [debouncedLoadData]);
  
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
    loading,
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
