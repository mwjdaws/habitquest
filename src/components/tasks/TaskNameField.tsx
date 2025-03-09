
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskNameFieldProps {
  name: string;
  nameError: string;
  onNameChange: (name: string) => void;
  onErrorClear: () => void;
}

export function TaskNameField({ name, nameError, onNameChange, onErrorClear }: TaskNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="taskName">Task Name *</Label>
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
      {nameError && <p className="text-sm text-destructive">{nameError}</p>}
    </div>
  );
}
