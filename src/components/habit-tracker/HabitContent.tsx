
import { Card, CardContent } from "@/components/ui/card";
import { HabitTrackerHeader } from "./HabitTrackerHeader";
import { ProgressBar } from "./ProgressBar";
import { HabitList } from "./HabitList";
import { EmptyState } from "./EmptyState";
import { RetryButton } from "./RetryButton";
import { LoadingState } from "../habit-list/LoadingState";
import { ErrorState } from "./ErrorState";

interface HabitContentProps {
  loading: boolean;
  error: any;
  isInitialized: boolean;
  totalCount: number;
  habits: any[];
  completions: any[];
  failures: any[];
  progress: number;
  completedCount: number;
  onToggleCompletion: (id: string) => Promise<void>;
  onLogFailure: (id: string) => void;
  onUndoFailure: (id: string) => Promise<void>;
  onRetry: () => void;
}

export function HabitContent({
  loading,
  error,
  isInitialized,
  totalCount,
  habits,
  completions,
  failures,
  progress,
  completedCount,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  onRetry
}: HabitContentProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <HabitTrackerHeader totalHabits={totalCount} isLoading={true} />
        <CardContent>
          <LoadingState />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <HabitTrackerHeader totalHabits={totalCount} isLoading={false} />
        <CardContent>
          <ErrorState error={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <HabitTrackerHeader totalHabits={totalCount} isLoading={false} />
      <CardContent>
        {habits.length === 0 ? (
          <>
            <EmptyState hasHabits={totalCount > 0} />
            {isInitialized && <RetryButton onRetry={onRetry} />}
          </>
        ) : (
          <>
            <ProgressBar 
              progress={progress} 
              completedCount={completedCount} 
              totalCount={totalCount} 
            />
            
            <HabitList
              habits={habits}
              completions={completions}
              failures={failures}
              onToggleCompletion={onToggleCompletion}
              onLogFailure={onLogFailure}
              onUndoFailure={onUndoFailure}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
