
import { useState } from 'react';
import { format } from 'date-fns';
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

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, currentStatus: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleToggleComplete = async () => {
    try {
      setIsCompleting(true);
      await onToggleComplete(task.id, task.status);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={`flex items-start p-4 border rounded-md mb-2 ${task.status === 'completed' ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex-shrink-0 pt-1">
        <Checkbox 
          checked={task.status === 'completed'}
          onCheckedChange={handleToggleComplete}
          disabled={isCompleting}
          className="size-5"
        />
      </div>
      
      <div className="ml-3 flex-grow">
        <div className={`text-base font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
          {task.name}
        </div>
        
        {task.description && (
          <div className={`mt-1 text-sm ${task.status === 'completed' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {task.description}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {task.due_date && (
            <div className="text-xs text-muted-foreground">
              Due: {format(new Date(task.due_date), 'PPP')}
            </div>
          )}
          
          {task.tag && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <TagIcon className="h-3 w-3" />
              {task.tag}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(task)}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
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
}
