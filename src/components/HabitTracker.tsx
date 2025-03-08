
import { Card, CardContent } from "@/components/ui/card";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { HabitList } from "./habit-tracker/HabitList";
import { HabitTrackerHeader } from "./habit-tracker/HabitTrackerHeader";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

export function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  
  const { 
    habits,
    completions,
    failures,
    loading,
    error,
    progress,
    completedCount,
    totalCount,
    handleToggleCompletion,
    handleLogFailure,
    refreshData,
    isInitialized
  } = useHabitTracking(onHabitChange);

  // Optimized retry handler
  const handleRetry = useCallback(() => {
    toast({ title: "Refreshing", description: "Refreshing your habit data..." });
    refreshData(true);
  }, [refreshData]);

  // Optimized failure handling
  const onLogFailure = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setHabitIdForFailure(habitId);
      setHabitNameForFailure(habit.name);
    }
  }, [habits]);

  const onConfirmFailure = useCallback(async (habitId: string, reason: string) => {
    await handleLogFailure(habitId, reason);
    setHabitIdForFailure(null);
  }, [handleLogFailure]);

  const onCancelFailure = useCallback(() => {
    setHabitIdForFailure(null);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setHabitIdForFailure(null);
  }, []);

  // More efficient content rendering with early returns
  if (loading || !isInitialized) {
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
          <ErrorState error={error} onRetry={handleRetry} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <HabitTrackerHeader totalHabits={totalCount} isLoading={false} />
        <CardContent>
          {habits.length === 0 ? (
            <EmptyState hasHabits={totalCount > 0} />
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
                onToggleCompletion={handleToggleCompletion}
                onLogFailure={onLogFailure}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <FailureDialog
        habitId={habitIdForFailure || ""}
        habitName={habitNameForFailure}
        open={!!habitIdForFailure}
        onOpenChange={handleDialogOpenChange}
        onConfirm={onConfirmFailure}
        onCancel={onCancelFailure}
      />
    </>
  );
}
