
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TaskDatePickerProps {
  dueDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function TaskDatePicker({ dueDate, onDateChange }: TaskDatePickerProps) {
  return (
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
            onSelect={onDateChange}
            initialFocus
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
    </div>
  );
}
