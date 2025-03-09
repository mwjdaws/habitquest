
import { Goal } from "@/hooks/useGoals";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatInTorontoTimezone, getCurrentTorontoDate } from "@/lib/dateUtils";

interface GoalHeaderProps {
  goal: Goal;
}

export function GoalHeader({ goal }: GoalHeaderProps) {
  // Format dates for display with Toronto timezone
  const startDate = new Date(goal.start_date);
  const endDate = new Date(goal.end_date);
  const currentDate = getCurrentTorontoDate();
  const isActive = currentDate >= startDate && currentDate <= endDate;
  const isPast = currentDate > endDate;
  
  const getStatusBadge = () => {
    if (isPast) {
      return goal.progress >= 100 ? (
        <Badge className="bg-green-500">Completed</Badge>
      ) : (
        <Badge variant="destructive">Expired</Badge>
      );
    }
    
    if (isActive) {
      return <Badge className="bg-blue-500">Active</Badge>;
    }
    
    return <Badge variant="outline">Upcoming</Badge>;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">{goal.name}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          {formatInTorontoTimezone(startDate, 'MMM d, yyyy')} - {formatInTorontoTimezone(endDate, 'MMM d, yyyy')}
        </span>
        {getStatusBadge()}
      </div>
    </div>
  );
}
