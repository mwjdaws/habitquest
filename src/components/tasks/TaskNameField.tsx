
import { Input } from '@/components/ui/input';
import { TaskFormFieldWrapper } from './form-fields/TaskFormFieldWrapper';

interface TaskNameFieldProps {
  name: string;
  nameError: string;
  onNameChange: (name: string) => void;
  onErrorClear: () => void;
}

export function TaskNameField({ name, nameError, onNameChange, onErrorClear }: TaskNameFieldProps) {
  return (
    <TaskFormFieldWrapper
      id="taskName"
      label="Task Name *"
      error={nameError}
    >
      <Input
        id="taskName"
        value={name}
        onChange={(e) => {
          onNameChange(e.target.value);
          if (e.target.value.trim()) onErrorClear();
        }}
        placeholder="Enter task name"
        className={nameError ? 'border-destructive' : ''}
      />
    </TaskFormFieldWrapper>
  );
}
