
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { HabitTrackerHeader } from "./HabitTrackerHeader";

export function AuthRequiredState() {
  return (
    <Card className="w-full">
      <HabitTrackerHeader 
        totalCount={0} 
        completedCount={0}
        progress={0}
        isLoading={false}
      />
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground text-center mb-4">
          You need to be signed in to view and track your habits.
        </p>
        <Button asChild>
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
