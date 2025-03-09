
import { Textarea } from '@/components/ui/textarea';
import { TaskFormFieldWrapper } from './form-fields/TaskFormFieldWrapper';

interface TaskDescriptionFieldProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export function TaskDescriptionField({ description, onDescriptionChange }: TaskDescriptionFieldProps) {
  return (
    <TaskFormFieldWrapper
      id="taskDescription"
      label="Description (Optional)"
    >
      <Textarea
        id="taskDescription"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Enter task description"
        className="min-h-[100px]"
      />
    </TaskFormFieldWrapper>
  );
}
