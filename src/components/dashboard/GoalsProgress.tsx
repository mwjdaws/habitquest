
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoals, Goal } from "@/hooks/useGoals";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCurrentTorontoDate } from "@/lib/dateUtils";

export function GoalsProgress() {
  const { goals, loading } = useGoals();
  const navigate = useNavigate();
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  
  useEffect(() => {
    if (goals.length) {
      // Filter to get active goals based on Toronto time
      const today = getCurrentTorontoDate();
      const active = goals.filter(goal => {
        const startDate = new Date(goal.start_date);
        const endDate = new Date(goal.end_date);
        return today >= startDate && today <= endDate;
      }).sort((a, b) => b.progress - a.progress); // Sort by progress
      
      setActiveGoals(active.slice(0, 3)); // Get top 3 most progressed active goals
    }
  }, [goals]);

  const navigateToGoals = () => {
    navigate('/goals');
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Goals Progress</CardTitle>
          <CardDescription>Track your progress towards your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Goals Progress</CardTitle>
        <CardDescription>Track your progress towards your goals</CardDescription>
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-sm">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full justify-between mt-2" 
              onClick={navigateToGoals}
            >
              <span>View all goals</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-base font-medium mb-1">No active goals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create goals to track your progress
            </p>
            <Button onClick={navigateToGoals}>Set Goals</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
