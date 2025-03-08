
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitTracker } from "@/components/HabitTracker";
import { Zap } from "lucide-react";
import { fetchHabits } from "@/lib/habits";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [topStreaks, setTopStreaks] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const loadingTimerRef = useRef<number | null>(null);
  const dataFetchTimerRef = useRef<number | null>(null);
  
  const loadStreaks = useCallback(async () => {
    if (!user) return;
    
    try {
      // Clear any existing timer to prevent multiple timers
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      // Only set loading to true if it's going to take more than 300ms
      loadingTimerRef.current = window.setTimeout(() => {
        setIsLoading(true);
      }, 200);
      
      const habits = await fetchHabits();
      
      // Get habits with streaks and sort by current streak
      const habitsWithStreaks = habits
        .filter(habit => habit.current_streak > 0)
        .sort((a, b) => b.current_streak - a.current_streak);
      
      setTopStreaks(habitsWithStreaks.slice(0, 3));
      
      // Clear the timer and set loading to false
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching streak data:", error);
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    // Clear any existing data fetch timer
    if (dataFetchTimerRef.current) {
      clearTimeout(dataFetchTimerRef.current);
    }
    
    // Set a small delay before fetching to prevent rapid fetch cycles
    dataFetchTimerRef.current = window.setTimeout(() => {
      loadStreaks();
    }, 100);
    
    return () => {
      // Clean up timers if component unmounts
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (dataFetchTimerRef.current) {
        clearTimeout(dataFetchTimerRef.current);
      }
    };
  }, [loadStreaks, lastRefresh]);

  // Function to trigger a refresh
  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  const renderStreakStats = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    if (topStreaks.length > 0) {
      return (
        <div className="space-y-4">
          {topStreaks.map(habit => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-8 rounded-full" 
                  style={{ backgroundColor: `var(--${habit.color})` }}
                />
                <div>
                  <div className="font-medium text-sm">{habit.name}</div>
                  <div className="text-xs text-muted-foreground">{habit.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full text-yellow-800">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">{habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
          
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Keep it up! Consistency is key to building lasting habits.
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          No active streaks yet. Complete your habits consistently to build streaks!
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HabitTracker onHabitChange={refreshData} key={lastRefresh} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Streak Stats
            </CardTitle>
            <CardDescription>Your current habit streaks</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStreakStats()}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect to Supabase to manage your tasks
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Goals Progress</CardTitle>
          <CardDescription>Track your progress towards your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to Supabase to track your goals progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
