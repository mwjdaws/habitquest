
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitTracker } from "@/components/HabitTracker";
import { Zap } from "lucide-react";
import { fetchHabits } from "@/lib/habits";
import { Habit } from "@/lib/habitTypes";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [topStreaks, setTopStreaks] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStreaks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const habits = await fetchHabits();
        
        // Get habits with streaks and sort by current streak
        const habitsWithStreaks = habits
          .filter(habit => habit.current_streak > 0)
          .sort((a, b) => b.current_streak - a.current_streak);
        
        setTopStreaks(habitsWithStreaks.slice(0, 3));
      } catch (error) {
        console.error("Error fetching streak data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStreaks();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HabitTracker />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Streak Stats
            </CardTitle>
            <CardDescription>Your current habit streaks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading streaks...</p>
            ) : topStreaks.length > 0 ? (
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
                
                {topStreaks.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    Keep it up! Consistency is key to building lasting habits.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No active streaks yet. Complete your habits consistently to build streaks!
                </p>
              </div>
            )}
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
