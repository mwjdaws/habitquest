
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { Task } from "@/lib/taskTypes";
import { fetchTasks, toggleTaskCompletion } from "@/lib/api/taskAPI";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function UpcomingTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    async function loadTasks() {
      try {
        setIsLoading(true);
        const allTasks = await fetchTasks();
        
        // Filter for pending tasks with due dates
        const pendingTasks = allTasks
          .filter(task => task.status === 'pending' && task.due_date)
          .sort((a, b) => {
            // Sort by due date
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          })
          .slice(0, 5); // Take only the first 5
          
        setTasks(pendingTasks);
      } catch (error) {
        console.error("Error loading upcoming tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [user]);

  const handleToggleComplete = async (taskId: string, currentStatus: string) => {
    try {
      setIsToggling(taskId);
      await toggleTaskCompletion(taskId, currentStatus);
      // Remove the completed task from the list
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Tasks due soon</CardDescription>
      </CardHeader>
      <CardContent>
        {!user ? (
          <p className="text-sm text-muted-foreground">
            Sign in to view your upcoming tasks
          </p>
        ) : isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming tasks due. Add tasks in the Tasks page.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-start space-x-2">
                <Checkbox 
                  checked={task.status === 'completed'}
                  onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                  disabled={isToggling === task.id}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.name}</p>
                  {task.due_date && (
                    <p className="text-xs text-muted-foreground">
                      Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => navigate('/tasks')}
          >
            View all tasks
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
