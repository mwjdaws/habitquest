
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FailureDialog } from "@/components/habit/FailureDialog";
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
import { HabitList } from "./habit-tracker/HabitList";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState([]);
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  const { user } = useAuth();
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  const loadData = async (showLoading = true) => {
    if (!user) return;
    
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const [habitsData, completionsData, failuresData] = await Promise.all([
        fetchHabits(),
        getCompletionsForDate(today),
        getFailuresForDate(today)
      ]);
      
      setHabits(habitsData);
      setCompletions(completionsData);
      setFailures(failuresData);
    } catch (error) {
      console.error("Error loading habit data:", error);
      setError("Failed to load habit data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load habit data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, today]);

  // Add a function to refresh data without showing loading state
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

  const handleLogFailure = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setHabitIdForFailure(habitId);
      setHabitNameForFailure(habit.name);
    }
  };

  const handleConfirmFailure = async (habitId: string, reason: string) => {
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
      
      setHabitIdForFailure(null);
    } catch (error) {
      console.error("Error logging failure:", error);
      toast({
        title: "Error",
        description: "Failed to log failure reason",
        variant: "destructive",
      });
    }
  };

  const handleCancelFailure = () => {
    setHabitIdForFailure(null);
  };

  const todaysHabits = habits.filter(habit => shouldShowHabitForDay(habit, todayName));
  
  const completedCount = todaysHabits.length > 0 
    ? todaysHabits.filter(habit => completions.some(c => c.habit_id === habit.id)).length 
    : 0;
  const progress = todaysHabits.length > 0 
    ? Math.round((completedCount / todaysHabits.length) * 100) 
    : 0;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (todaysHabits.length === 0) {
    return <EmptyState hasHabits={habits.length > 0} />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle>Today's Habits</CardTitle>
            <CardDescription>Your habit progress for today</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/habits" className="flex items-center text-sm font-medium">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ProgressBar 
            progress={progress} 
            completedCount={completedCount} 
            totalCount={todaysHabits.length} 
          />
          
          <HabitList
            habits={todaysHabits}
            completions={completions}
            failures={failures}
            onToggleCompletion={handleToggleCompletion}
            onLogFailure={handleLogFailure}
          />
        </CardContent>
      </Card>
      
      <FailureDialog
        habitId={habitIdForFailure || ""}
        habitName={habitNameForFailure}
        open={!!habitIdForFailure}
        onOpenChange={(open) => {
          if (!open) setHabitIdForFailure(null);
        }}
        onConfirm={handleConfirmFailure}
        onCancel={handleCancelFailure}
      />
    </>
  );
}
