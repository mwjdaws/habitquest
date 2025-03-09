
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy } from "lucide-react";
import { ChartContainer } from "./ChartContainer";

type StreakRecordsProps = {
  streakRecords: any[];
  loading: boolean;
};

export function StreakRecords({ streakRecords, loading }: StreakRecordsProps) {
  return (
    <ChartContainer 
      loading={loading} 
      isEmpty={streakRecords.length === 0} 
      emptyMessage="No streak data available"
      height="auto"
    >
      <div className="space-y-4">
        {streakRecords.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-3 bg-card border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{record.name}</div>
                <div className="text-sm text-muted-foreground">
                  Longest streak: {record.longest_streak} days
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={record.current_streak > 0 ? "default" : "outline"}
                className="flex items-center space-x-1"
              >
                <Flame className="h-3 w-3" />
                <span>{record.current_streak} day{record.current_streak !== 1 ? 's' : ''}</span>
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
}
