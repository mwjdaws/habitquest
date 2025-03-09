
import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/lib/taskTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Loader2, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { fetchTasks } from '@/lib/api/taskAPI';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  initialData?: Task;
  title: string;
}

export function TaskForm({ onSubmit, onCancel, initialData, title }: TaskFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.due_date ? new Date(initialData.due_date) : undefined
  );
  const [tag, setTag] = useState<string | undefined>(initialData?.tag || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { user } = useAuth();
  
  // Fetch available tags from existing tasks
  useEffect(() => {
    if (!user) return;
    
    const loadTags = async () => {
      try {
        const tasks = await fetchTasks();
        const tags = tasks
          .filter(task => task.tag) // Filter out tasks without tags
          .map(task => task.tag as string) // Extract the tag
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };
    
    loadTags();
  }, [user]);
  
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
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
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
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name *</Label>
            <Input
              id="taskName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              placeholder="Enter task name"
              className={nameError ? 'border-destructive' : ''}
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Description (Optional)</Label>
            <Textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setDueDate(undefined)}
                className="mt-1"
              >
                Clear date
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taskTag">Tag (Optional)</Label>
            <Select 
              value={tag} 
              onValueChange={setTag}
            >
              <SelectTrigger id="taskTag" className="w-full">
                <SelectValue placeholder="Select or enter a tag">
                  {tag ? (
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-4 w-4" />
                      {tag}
                    </div>
                  ) : (
                    <span>Select or enter a tag</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* Option to clear the tag */}
                <SelectItem value="">
                  <span className="text-muted-foreground">No tag</span>
                </SelectItem>
                
                {/* Available tags from existing tasks */}
                {availableTags.length > 0 && availableTags.map((tagName) => (
                  <SelectItem key={tagName} value={tagName}>
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-4 w-4" />
                      {tagName}
                    </div>
                  </SelectItem>
                ))}
                
                {/* Custom tag input */}
                {tag && !availableTags.includes(tag) && (
                  <SelectItem value={tag}>
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-4 w-4" />
                      {tag}
                    </div>
                  </SelectItem>
                )}
                
                {/* Option to create a new tag */}
                <div className="px-2 py-1.5">
                  <Label htmlFor="newTag">Create new tag:</Label>
                  <Input
                    id="newTag"
                    placeholder="Enter new tag"
                    className="mt-1"
                    value={tag === undefined ? "" : tag}
                    onChange={(e) => {
                      if (e.target.value) {
                        setTag(e.target.value);
                      } else {
                        setTag(undefined);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </SelectContent>
            </Select>
            {tag && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setTag(undefined)}
                className="mt-1"
              >
                Clear tag
              </Button>
            )}
          </div>
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
