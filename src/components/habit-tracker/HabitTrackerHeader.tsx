
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface HabitTrackerHeaderProps {
  totalHabits?: number;
  isLoading?: boolean;
}

export function HabitTrackerHeader({ totalHabits = 0, isLoading = false }: HabitTrackerHeaderProps) {
  // Determine the appropriate description based on loading and habit count
  const getDescription = () => {
    if (isLoading) {
      return 'Loading your habits for today...';
    }
    
    if (totalHabits > 0) {
      return `Your habit progress for today (${totalHabits} habit${totalHabits !== 1 ? 's' : ''})`;
    }
    
    return 'No habits scheduled for today';
  };

  return (
    <CardHeader className="flex flex-row items-start justify-between pb-2">
      <div>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/habits" className="flex items-center text-sm font-medium">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </CardHeader>
  );
}
