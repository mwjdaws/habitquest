
import { useState, useCallback, memo } from 'react';
import { Task } from '@/lib/taskTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { formatInTorontoTimezone } from '@/lib/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, currentStatus: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

// Using memo to prevent unnecessary re-renders
export const TaskItem = memo(function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleToggleComplete = useCallback(async () => {
    try {
      setIsCompleting(true);
      await onToggleComplete(task.id, task.status);
    } finally {
      setIsCompleting(false);
    }
  }, [task.id, task.status, onToggleComplete]);
  
  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
    }
  }, [task.id, onDelete]);
  
  const handleEdit = useCallback(() => onEdit(task), [task, onEdit]);
  
  const isCompleted = task.status === 'completed';
  
  return (
    <div 
      className={`flex items-start p-4 border rounded-md mb-2 ${isCompleted ? 'bg-muted/50' : 'bg-card'}`}
      role="listitem"
    >
      <div className="flex-shrink-0 pt-1">
        <Checkbox 
          checked={isCompleted}
          onCheckedChange={handleToggleComplete}
          disabled={isCompleting}
          className="size-5"
          id={`task-${task.id}`}
          aria-label={`Mark task "${task.name}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>
      
      <div className="ml-3 flex-grow">
        <label 
          htmlFor={`task-${task.id}`}
          className={`text-base font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
        >
          {task.name}
        </label>
        
        {task.description && (
          <div 
            className={`mt-1 text-sm ${isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}
            id={`description-${task.id}`}
          >
            {task.description}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {task.due_date && (
            <div className="text-xs text-muted-foreground" aria-label="Due date">
              Due: {formatInTorontoTimezone(new Date(task.due_date), 'PPP')}
            </div>
          )}
          
          {task.tag && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <TagIcon className="h-3 w-3" aria-hidden="true" />
              {task.tag}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex space-x-1" role="group" aria-label="Task actions">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleEdit}
          className="h-8 w-8"
          aria-label="Edit task"
        >
          <Edit className="h-4 w-4" aria-hidden="true" />
        </Button>
        
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});
