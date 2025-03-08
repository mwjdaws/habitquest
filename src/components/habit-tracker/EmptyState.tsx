
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

type EmptyStateProps = {
  hasHabits: boolean;
};

export function EmptyState({ hasHabits }: EmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>Your habit progress for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            {hasHabits
              ? "You don't have any habits scheduled for today."
              : "You don't have any habits set up yet."}
          </p>
          <Button asChild>
            <Link to="/habits">
              <Flame className="mr-2 h-4 w-4" />
              {hasHabits ? "Manage Habits" : "Create Your First Habit"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
