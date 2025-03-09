
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TaskDescriptionFieldProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export function TaskDescriptionField({ description, onDescriptionChange }: TaskDescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="taskDescription">Description (Optional)</Label>
      <Textarea
        id="taskDescription"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Enter task description"
        className="min-h-[100px]"
      />
    </div>
  );
}
