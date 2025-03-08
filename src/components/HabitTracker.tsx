
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Flame } from "lucide-react";
import { fetchHabits, getCompletionsForDate, getTodayFormatted, getDayName, shouldShowHabitForDay, toggleHabitCompletion, Habit, HabitCompletion } from "@/lib/habits";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const today = getTodayFormatted();
  const todayName = getDayName(new Date());

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [habitsData, completionsData] = await Promise.all([
          fetchHabits(),
          getCompletionsForDate(today)
        ]);
        
        setHabits(habitsData);
        setCompletions(completionsData);
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
        // Include user_id to fix TypeScript error
        const newCompletion: HabitCompletion = {
          id: crypto.randomUUID(),
          habit_id: habitId,
          user_id: user.id,
          completed_date: today,
          created_at: new Date().toISOString()
        };
        setCompletions([...completions, newCompletion]);
      }
      
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

  // Filter habits for today
  const todaysHabits = habits.filter(habit => shouldShowHabitForDay(habit, todayName));
  
  // Calculate progress
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
            return (
              <div 
                key={habit.id} 
                className={`p-2 rounded-md flex items-center justify-between gap-4 border ${
                  isCompleted ? "bg-green-50 border-green-200" : "bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-1 h-10 rounded-full" 
                    style={{ backgroundColor: `var(--${habit.color})` }}
                  />
                  <div>
                    <div className="font-medium text-sm">
                      {habit.name}
                    </div>
                    {habit.description && (
                      <div className="text-xs text-muted-foreground">
                        {habit.description}
                      </div>
                    )}
                  </div>
                </div>
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
