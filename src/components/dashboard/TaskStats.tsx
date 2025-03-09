
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Filter, CheckCircle, XCircle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useTaskTags } from "@/hooks/useTaskTags";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
        <CardTitle className="text-md font-medium">Task Stats</CardTitle>
        <div className="flex items-center space-x-2">
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tag filter */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="tagFilter">Filter by Tag</Label>
            </div>
            <Select
              value={selectedTag || ""}
              onValueChange={(value) => setSelectedTag(value === "" ? null : value)}
            >
              <SelectTrigger id="tagFilter">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border p-2 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
            <div className="rounded-md border p-2 text-center bg-green-50">
              <p className="text-xs text-muted-foreground flex items-center justify-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Completed
              </p>
              <p className="text-lg font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="rounded-md border p-2 text-center bg-orange-50">
              <p className="text-xs text-muted-foreground flex items-center justify-center">
                <XCircle className="h-3 w-3 mr-1 text-orange-500" />
                Pending
              </p>
              <p className="text-lg font-bold text-orange-500">{stats.pending}</p>
            </div>
          </div>

          {/* Bar chart visualization */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Completion Rate</p>
            <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
              {stats.completionPercentage > 0 && (
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {stats.completionPercentage}%
              </span>
              <span className="flex items-center">
                <XCircle className="h-3 w-3 mr-1 text-orange-500" />
                {stats.pendingPercentage}%
              </span>
            </div>
          </div>

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
