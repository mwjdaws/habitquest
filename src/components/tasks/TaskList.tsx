
import { useState } from 'react';
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

export function TaskList({ tasks, isLoading, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });
  
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
  
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  
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
}
