
import { useState, useEffect, useRef } from "react";
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
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  const loadData = async (showLoading = true) => {
    if (!user) return;
    
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Clear any existing timer
      if (dataRefreshTimerRef.current) {
        clearTimeout(dataRefreshTimerRef.current);
      }
      
      console.log('Fetching habit data...');
      
      // Use Promise.allSettled to prevent one failure from failing the entire request
      const results = await Promise.allSettled([
        fetchHabits(),
        getCompletionsForDate(today),
        getFailuresForDate(today)
      ]);
      
      // Process results safely
      const habitsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const completionsData = results[1].status === 'fulfilled' ? results[1].value : [];
      const failuresData = results[2].status === 'fulfilled' ? results[2].value : [];
      
      // Check if any promise was rejected and log it
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to fetch data for request ${index}:`, result.reason);
        }
      });
      
      console.log(`Loaded ${habitsData.length} habits, ${completionsData.length} completions, ${failuresData.length} failures`);
      
      setHabits(habitsData);
      setCompletions(completionsData);
      setFailures(failuresData);
      
      // Notify parent components that data has changed
      if (onHabitChange) {
        onHabitChange();
      }
    } catch (error) {
      console.error("Error loading habit data:", error);
      setError("Failed to load habit data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load habit data",
        variant: "destructive",
      });
    } finally {
      // Add a small delay to prevent flashing of loading state
      dataRefreshTimerRef.current = window.setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (user) {
      initialLoadAttemptedRef.current = true;
      
      // Small delay before the initial load
      const initialLoadTimer = setTimeout(() => {
        loadData();
      }, 100);
      
      return () => {
        clearTimeout(initialLoadTimer);
        if (dataRefreshTimerRef.current) {
          clearTimeout(dataRefreshTimerRef.current);
        }
      };
    }
  }, [user]);

  // Ensure we reload data when the date changes
  useEffect(() => {
    if (initialLoadAttemptedRef.current && user) {
      loadData();
    }
  }, [today]);

  // Refresh data without showing loading state
  const refreshData = () => {
    loadData(false);
  };

  const handleToggleCompletion = async (habitId: string) => {
    if (!user) return;
    
    try {
      const isCompleted = completions.some(c => c.habit_id === habitId);
      await toggleHabitCompletion(habitId, today, isCompleted);
      
      // Update local state
      if (isCompleted) {
        setCompletions(completions.filter(c => c.habit_id !== habitId));
      } else {
        const newCompletion = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          created_at: new Date().toISOString()
        };
        setCompletions([...completions, newCompletion]);

        // Remove any failure for this habit on this day
        setFailures(failures.filter(f => f.habit_id !== habitId));
      }
      
      // Refresh habit data to get updated streak
      refreshData();
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      toast({
        title: "Error",
        description: "Failed to update habit status",
        variant: "destructive",
      });
    }
  };

  const handleLogFailure = async (habitId: string, reason: string) => {
    if (!user) return;
    
    try {
      await logHabitFailure(habitId, today, reason);
      
      // Update local state
      const newFailure = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        user_id: user.id,
        failure_date: today,
        reason,
        created_at: new Date().toISOString()
      };
      
      // Remove any completions for this habit on this day
      setCompletions(completions.filter(c => c.habit_id !== habitId));
      
      // Add the failure or replace existing one
      setFailures(failures.filter(f => f.habit_id !== habitId).concat(newFailure));
      
      // Refresh habit data to get updated streak
      const refreshedHabits = await fetchHabits();
      setHabits(refreshedHabits);
      
      toast({
        title: "Reason logged",
        description: "Thanks for your honesty. You'll do better tomorrow!",
      });
    } catch (error) {
      console.error("Error logging failure:", error);
      toast({
        title: "Error",
        description: "Failed to log failure reason",
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
    loading,
    error,
    progress,
    completedCount,
    totalCount: todaysHabits.length,
    handleToggleCompletion,
    handleLogFailure,
  };
}
