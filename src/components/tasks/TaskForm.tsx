
import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/lib/taskTypes';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskNameField } from './TaskNameField';
import { TaskDescriptionField } from './TaskDescriptionField';
import { TaskDatePicker } from './TaskDatePicker';
import { TaskTagSelect } from './TaskTagSelect';
import { useTaskTags } from '@/hooks/useTaskTags';
import { formatInTorontoTimezone, toTorontoTime } from '@/lib/dateUtils';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  initialData?: Task;
  title: string;
}

export function TaskForm({ onSubmit, onCancel, initialData, title }: TaskFormProps) {
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.due_date ? toTorontoTime(new Date(initialData.due_date)) : undefined
  );
  const [tag, setTag] = useState<string | undefined>(initialData?.tag || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');
  
  // Use our new tag management hook
  const { availableTags } = useTaskTags();
  
  const handleTagChange = (newTag: string | undefined) => {
    setTag(newTag);
  };
  
  const handleClearNameError = () => {
    setNameError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setNameError('Task name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const taskData: CreateTaskData | UpdateTaskData = {
        name: name.trim(),
        description: description.trim() || null,
        due_date: dueDate ? formatInTorontoTimezone(dueDate, 'yyyy-MM-dd') : null,
        tag: tag || null,
      };
      
      await onSubmit(taskData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <TaskNameField 
            name={name}
            nameError={nameError}
            onNameChange={setName}
            onErrorClear={handleClearNameError}
          />
          
          <TaskDescriptionField 
            description={description}
            onDescriptionChange={setDescription}
          />
          
          <TaskDatePicker 
            dueDate={dueDate}
            onDateChange={setDueDate}
          />
          
          <TaskTagSelect 
            tag={tag}
            onTagChange={handleTagChange}
            availableTags={availableTags}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
