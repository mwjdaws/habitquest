
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
  const [dataInitialized, setDataInitialized] = useState(false);
  const loadingTimerRef = useRef<number | null>(null);
  const dataFetchTimerRef = useRef<number | null>(null);
  const initialDataFetchedRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const mountedRef = useRef(true);
  
  // Improved streak data loading with better debouncing
  const loadStreaks = useCallback(async (showLoading = true) => {
    if (!user || !mountedRef.current) return;
    
    // Stronger debouncing with 5-second interval
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 5000 && initialDataFetchedRef.current) {
      console.log('Skipping streak data fetch - too soon since last fetch');
      return;
    }
    
    lastFetchTimeRef.current = now;
    
    try {
      // Only show loading state for initial load
      if (showLoading && !initialDataFetchedRef.current) {
        setIsLoading(true);
      }
      
      console.log('Fetching streaks data...');
      const habits = await fetchHabits();
      
      if (!mountedRef.current) return;
      
      // Get habits with streaks and sort by current streak
      const habitsWithStreaks = habits
        .filter(habit => habit.current_streak > 0)
        .sort((a, b) => b.current_streak - a.current_streak);
      
      setTopStreaks(habitsWithStreaks.slice(0, 3));
      initialDataFetchedRef.current = true;
      setDataInitialized(true);
      
      // Add a small delay before hiding loading state to prevent UI jumps
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
      
      loadingTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }, 300);
    } catch (error) {
      console.error("Error fetching streak data:", error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user]);
  
  // Set up initial data fetch and cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    // Clear any existing timers
    if (dataFetchTimerRef.current) {
      window.clearTimeout(dataFetchTimerRef.current);
    }
    
    // Set a small delay before fetching
    dataFetchTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        loadStreaks(true);
      }
    }, 800); // Increased delay to ensure auth is ready
    
    // Set up interval for periodic refresh (every 5 minutes)
    const refreshInterval = window.setInterval(() => {
      if (mountedRef.current && initialDataFetchedRef.current) {
        loadStreaks(false); // Don't show loading for background refreshes
      }
    }, 300000); // 5 minutes
    
    return () => {
      mountedRef.current = false;
      
      // Clean up all timers
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
      if (dataFetchTimerRef.current) {
        window.clearTimeout(dataFetchTimerRef.current);
      }
      window.clearInterval(refreshInterval);
    };
  }, [loadStreaks, lastRefresh]);

  // Function to trigger a refresh
  const refreshData = useCallback(() => {
    if (Date.now() - lastRefresh > 3000) { // Debounce refreshes
      setLastRefresh(Date.now());
    }
  }, [lastRefresh]);

  const renderStreakStats = () => {
    if (isLoading || !dataInitialized) {
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
        <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${lastRefresh}`} />
        
        <Card className="w-full">
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
        
        <Card className="w-full">
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
      
      <Card className="w-full">
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
