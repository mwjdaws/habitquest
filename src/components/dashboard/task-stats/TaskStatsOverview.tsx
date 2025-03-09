
import { CheckCircle, XCircle } from "lucide-react";

interface TaskStatsOverviewProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export function TaskStatsOverview({ stats }: TaskStatsOverviewProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-md border p-2 text-center">
        <p className="text-xs text-muted-foreground">Total</p>
        <p className="text-lg font-bold">{stats.total}</p>
      </div>
      <div className="rounded-md border p-2 text-center bg-green-50">
        <p className="text-xs text-muted-foreground flex items-center justify-center">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          Completed
        </p>
        <p className="text-lg font-bold text-green-600">{stats.completed}</p>
      </div>
      <div className="rounded-md border p-2 text-center bg-orange-50">
        <p className="text-xs text-muted-foreground flex items-center justify-center">
          <XCircle className="h-3 w-3 mr-1 text-orange-500" />
          Pending
        </p>
        <p className="text-lg font-bold text-orange-500">{stats.pending}</p>
      </div>
    </div>
  );
}
