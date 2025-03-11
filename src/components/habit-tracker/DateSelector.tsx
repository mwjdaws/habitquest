
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, isBefore, isAfter, isToday as dateFnsIsToday } from "date-fns";
import { cn } from "@/lib/utils";
import { getTodayFormatted } from "@/lib/habitUtils";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  isToday: boolean;
}

/**
 * Date selector component for habit tracking that allows users to:
 * - View and select dates from a calendar
 * - Navigate between days using previous/next buttons
 * - Return to today with a dedicated button
 * 
 * The component prevents selection of future dates for habit tracking.
 */
export function DateSelector({ selectedDate, onDateChange, isToday }: DateSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Convert ISO date string to Date object
  const selectedDateObj = new Date(selectedDate);
  const today = new Date();
  
  // Set time to 00:00:00 for accurate date comparison
  today.setHours(0, 0, 0, 0);
  
  // Handle date selection from calendar
  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    // Format as YYYY-MM-DD ISO string
    const formattedDate = format(date, "yyyy-MM-dd");
    onDateChange(formattedDate);
    setIsCalendarOpen(false);
  };
  
  // Handle navigation to previous day
  const goToPreviousDay = () => {
    const previousDay = addDays(selectedDateObj, -1);
    onDateChange(format(previousDay, "yyyy-MM-dd"));
  };
  
  // Handle navigation to next day (only if not beyond today)
  const goToNextDay = () => {
    const nextDay = addDays(selectedDateObj, 1);
    if (!isAfter(nextDay, today)) {
      onDateChange(format(nextDay, "yyyy-MM-dd"));
    }
  };
  
  // Handle return to today
  const goToToday = () => {
    onDateChange(getTodayFormatted());
  };
  
  // Determine if we can go to next day (not beyond today)
  const canGoToNextDay = !dateFnsIsToday(selectedDateObj);
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDateObj, "EEEE, MMMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleSelectDate}
              disabled={(date) => isAfter(date, today)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          disabled={!canGoToNextDay}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {!isToday && (
        <Button 
          variant="secondary" 
          onClick={goToToday}
          size="sm"
        >
          Go to Today
        </Button>
      )}
    </div>
  );
}
