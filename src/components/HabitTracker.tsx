
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Flame, Tag, Zap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [failures, setFailures] = useState<HabitFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  const { user } = useAuth();
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
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

    loadData();
  }, [user, today]);

  const handleToggleCompletion = async (habitId: string) => {
    if (!user) return;
    
    try {
      const isCompleted = completions.some(c => c.habit_id === habitId);
      await toggleHabitCompletion(habitId, today, isCompleted);
      
      // Update local state
      if (isCompleted) {
        setCompletions(completions.filter(c => c.habit_id !== habitId));
      } else {
        const newCompletion: HabitCompletion = {
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
      const refreshedHabits = await fetchHabits();
      setHabits(refreshedHabits);
      
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
      const newFailure: HabitFailure = {
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>Your habit progress for today</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading habits...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>Your habit progress for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 border border-red-300 bg-red-50 text-red-900 rounded-md">
            <p className="text-sm font-medium">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todaysHabits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>Your habit progress for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              {habits.length === 0 
                ? "You don't have any habits set up yet." 
                : "You don't have any habits scheduled for today."}
            </p>
            <Button asChild>
              <Link to="/habits">
                <Flame className="mr-2 h-4 w-4" />
                {habits.length === 0 ? "Create Your First Habit" : "Manage Habits"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{progress}% complete</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{todaysHabits.length} habits
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            {todaysHabits.map(habit => {
              const isCompleted = completions.some(c => c.habit_id === habit.id);
              const isFailed = failures.some(f => f.habit_id === habit.id);
              
              return (
                <div 
                  key={habit.id} 
                  className={`p-2 rounded-md flex items-center justify-between gap-4 border ${
                    isCompleted ? "bg-green-50 border-green-200" : 
                    isFailed ? "bg-red-50 border-red-200" : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1 h-10 rounded-full" 
                      style={{ backgroundColor: `var(--${habit.color})` }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {habit.name}
                          {habit.current_streak > 0 && (
                            <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs font-normal">
                          <Tag className="h-3 w-3 mr-1" />
                          {habit.category}
                        </Badge>
                      </div>
                      {habit.description && (
                        <div className="text-xs text-muted-foreground">
                          {habit.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {isFailed ? (
                      <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center">
                        <X className="mr-1 h-3 w-3" />
                        {failures.find(f => f.habit_id === habit.id)?.reason || "Failed"}
                      </div>
                    ) : (
                      <>
                        {!isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleLogFailure(habit.id)}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Skip
                          </Button>
                        )}
                        <Button
                          variant={isCompleted ? "default" : "outline"}
                          size="sm"
                          className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
                          onClick={() => handleToggleCompletion(habit.id)}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Done
                            </>
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
