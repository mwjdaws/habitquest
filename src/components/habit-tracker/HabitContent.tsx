
import { memo } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { HabitList } from "./HabitList";
import { ProgressBar } from "./ProgressBar";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { HabitTrackerHeader } from "./HabitTrackerHeader";
import { getTodayFormatted } from "@/lib/habits";

interface HabitContentProps {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  totalCount: number;
  habits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  progress: number;
  completedCount: number;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  onRetry: () => void;
  selectedDate?: string;
}

export const HabitContent = memo(function HabitContent({
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
  onRetry,
  selectedDate = getTodayFormatted()
}: HabitContentProps) {
  // Show loading state if not initialized or loading
  if (loading && !isInitialized) {
    return <LoadingState />;
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Show empty state if no habits
  if (isInitialized && habits.length === 0) {
    return <EmptyState hasHabits={false} />;
  }

  return (
    <div className="space-y-4">
      <HabitTrackerHeader
        totalCount={totalCount}
        completedCount={completedCount}
        progress={progress}
        isLoading={loading}
        selectedDate={selectedDate}
      />
      
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
        selectedDate={selectedDate}
      />
    </div>
  );
});
