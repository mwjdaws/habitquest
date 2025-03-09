
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatInTorontoTimezone } from '@/lib/dateUtils';
import { TaskFormFieldWrapper } from './form-fields/TaskFormFieldWrapper';

interface TaskDatePickerProps {
  dueDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function TaskDatePicker({ dueDate, onDateChange }: TaskDatePickerProps) {
  return (
    <TaskFormFieldWrapper
      id="taskDueDate"
      label="Due Date (Optional)"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="taskDueDate"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? formatInTorontoTimezone(dueDate, 'PPP') : <span>Pick a due date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {dueDate && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onDateChange(undefined)}
          className="mt-1"
        >
          Clear date
        </Button>
      )}
    </TaskFormFieldWrapper>
  );
}
