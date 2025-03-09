
import { FormFieldComponent } from '@/components/ui/form-field';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { formatInTorontoTimezone } from '@/lib/dateUtils';

interface TaskDatePickerProps {
  dueDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function TaskDatePicker({ dueDate, onDateChange }: TaskDatePickerProps) {
  return (
    <FormFieldComponent
      id="taskDueDate"
      label="Due Date (Optional)"
    >
      <div className="flex">
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
              {dueDate ? formatInTorontoTimezone(dueDate, 'PPP') : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {dueDate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDateChange(undefined)}
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FormFieldComponent>
  );
}
