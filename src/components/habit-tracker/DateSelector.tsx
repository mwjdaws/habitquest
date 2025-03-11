
import { useState, useEffect } from "react";
import { format, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { formatTorontoDate } from "@/lib/dateUtils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateSelectorProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  isToday: boolean;
};

export function DateSelector({ selectedDate, onDateChange, isToday }: DateSelectorProps) {
  // Local state for the date
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? parseISO(selectedDate) : new Date()
  );

  // Function to format the date for display
  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "EEEE, MMMM d");
  };

  // Update the date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setDate(parseISO(selectedDate));
    }
  }, [selectedDate]);

  // Handle date change from the calendar
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateChange(formatTorontoDate(newDate));
    }
  };

  // Handle navigating to previous day
  const handlePreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
      onDateChange(formatTorontoDate(newDate));
    }
  };

  // Handle navigating to next day
  const handleNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      
      // Don't allow selecting future dates
      if (newDate <= new Date()) {
        setDate(newDate);
        onDateChange(formatTorontoDate(newDate));
      }
    }
  };

  // Handle returning to today
  const handleGoToToday = () => {
    const today = new Date();
    setDate(today);
    onDateChange(formatTorontoDate(today));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handlePreviousDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDateForDisplay(date) : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNextDay}
          disabled={isToday}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {!isToday && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleGoToToday}
        >
          Go to Today
        </Button>
      )}
    </div>
  );
}
