
import { memo } from "react";
import { isToday } from "@/hooks/habit-tracking/utils/commonUtils";
import { format } from "date-fns";

type HabitTrackerHeaderProps = {
  totalCount: number;
  completedCount: number;
  progress: number;
  isLoading: boolean;
  selectedDate?: string;
};

export const HabitTrackerHeader = memo(function HabitTrackerHeader({
  totalCount,
  completedCount,
  progress,
  isLoading,
  selectedDate
}: HabitTrackerHeaderProps) {
  const todayMode = !selectedDate || isToday(selectedDate);
  const dateDisplay = selectedDate ? 
    format(new Date(selectedDate), "MMMM d, yyyy") : 
    "Today";
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">
          {todayMode ? "Today's Habits" : `Habits for ${dateDisplay}`}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : 
            `${completedCount} of ${totalCount} complete${totalCount === 1 ? "" : "s"} (${Math.round(progress)}%)`}
        </p>
      </div>
    </div>
  );
});
