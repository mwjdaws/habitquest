
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Filter, CheckCircle, XCircle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useTaskTags } from "@/hooks/useTaskTags";
import { TaskStatsFilter } from "./task-stats/TaskStatsFilter";
import { TaskStatsOverview } from "./task-stats/TaskStatsOverview";
import { TaskStatsProgressBar } from "./task-stats/TaskStatsProgressBar";

interface TaskStatistic {
  completed: number;
  pending: number;
  total: number;
  completionPercentage: number;
  pendingPercentage: number;
}

export function TaskStats() {
  const { tasks } = useTasks();
  const { availableTags } = useTaskTags();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Calculate task statistics based on the selected tag
  const stats = useMemo(() => {
    // Filter tasks by tag if one is selected
    const filteredTasks = selectedTag 
      ? tasks.filter(task => task.tag === selectedTag)
      : tasks;
    
    const completed = filteredTasks.filter(task => task.status === 'completed').length;
    const total = filteredTasks.length;
    const pending = total - completed;
    
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const pendingPercentage = total > 0 ? Math.round((pending / total) * 100) : 0;
    
    return {
      completed,
      pending,
      total,
      completionPercentage,
      pendingPercentage
    };
  }, [tasks, selectedTag]);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Task Completion Metrics</CardTitle>
        <div className="flex items-center space-x-2">
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TaskStatsFilter 
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            availableTags={availableTags}
          />

          <TaskStatsOverview stats={stats} />

          <TaskStatsProgressBar 
            completionPercentage={stats.completionPercentage} 
            pendingPercentage={stats.pendingPercentage}
          />

          {/* Additional information about filtered tasks */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            {selectedTag ? (
              <p>Showing stats for tag: <span className="font-medium">{selectedTag}</span></p>
            ) : (
              <p>Showing stats for all tasks</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
