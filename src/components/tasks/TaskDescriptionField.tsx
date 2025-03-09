
import { Textarea } from '@/components/ui/textarea';
import { FormFieldComponent } from '@/components/ui/form-field';

interface TaskDescriptionFieldProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export function TaskDescriptionField({ description, onDescriptionChange }: TaskDescriptionFieldProps) {
  return (
    <FormFieldComponent
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
    </FormFieldComponent>
  );
}
