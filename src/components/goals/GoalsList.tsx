
import { Goal } from "@/hooks/useGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalItem } from "./GoalItem";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalsListProps {
  goals: Goal[];
  loading: boolean;
  onRefresh: () => void;
}

export function GoalsList({ goals, loading, onRefresh }: GoalsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-8 w-full mb-2" />
              <div className="space-y-3 mt-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first goal by clicking the "Create Goal" button above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Your Goals</h2>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
