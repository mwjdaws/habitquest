
import { useState, useMemo, memo } from 'react';
import { Task } from '@/lib/taskTypes';
import { TaskItem } from './TaskItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (taskId: string, currentStatus: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export const TaskList = memo(function TaskList({ 
  tasks, 
  isLoading, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Use memoization for filtered tasks to avoid recalculating on every render
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => filter === 'pending' 
      ? task.status === 'pending' 
      : task.status === 'completed'
    );
  }, [tasks, filter]);
  
  // Pre-calculate counts once
  const { pendingCount, completedCount } = useMemo(() => {
    let pending = 0;
    let completed = 0;
    
    tasks.forEach(task => {
      if (task.status === 'pending') pending++;
      else if (task.status === 'completed') completed++; 
    });
    
    return { pendingCount: pending, completedCount: completed };
  }, [tasks]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks found. Create your first task to get started.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No tasks found</div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No pending tasks</div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No completed tasks</div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
