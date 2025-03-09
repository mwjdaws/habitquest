
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { formatInTorontoTimezone, toTorontoTime } from '@/lib/dateUtils';

interface DatePickerFieldProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  error: string;
  minDate?: Date;
}

export function DatePickerField({ label, date, onDateChange, error, minDate }: DatePickerFieldProps) {
  // Convert the displayed date to Toronto timezone
  const displayDate = date ? toTorontoTime(date) : undefined;
  
  // Handle date selection and convert to Toronto timezone
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayDate && "text-muted-foreground",
              error ? "border-red-500" : ""
            )}
          >
            {displayDate ? formatInTorontoTimezone(displayDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={minDate ? (current => current < minDate) : undefined}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
