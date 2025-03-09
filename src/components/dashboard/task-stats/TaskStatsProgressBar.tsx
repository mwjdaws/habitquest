
import { CheckCircle, XCircle } from "lucide-react";

interface TaskStatsProgressBarProps {
  completionPercentage: number;
  pendingPercentage: number;
}

export function TaskStatsProgressBar({ completionPercentage, pendingPercentage }: TaskStatsProgressBarProps) {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium">Completion Rate</p>
      <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
        {completionPercentage > 0 && (
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          {completionPercentage}%
        </span>
        <span className="flex items-center">
          <XCircle className="h-3 w-3 mr-1 text-orange-500" />
          {pendingPercentage}%
        </span>
      </div>
    </div>
  );
}
