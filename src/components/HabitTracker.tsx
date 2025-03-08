
import { Card, CardContent } from "@/components/ui/card";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { useHabitTracking } from "@/hooks/useHabitTracking";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { HabitList } from "./habit-tracker/HabitList";
import { HabitTrackerHeader } from "./habit-tracker/HabitTrackerHeader";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";
import { useState, useEffect } from "react";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

export function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  const [showLoading, setShowLoading] = useState(true);
  
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
    handleLogFailure
  } = useHabitTracking(onHabitChange);

  // Add a slight delay before showing content to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(loading);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [loading]);

  const onLogFailure = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setHabitIdForFailure(habitId);
      setHabitNameForFailure(habit.name);
    }
  };

  const onConfirmFailure = async (habitId: string, reason: string) => {
    await handleLogFailure(habitId, reason);
    setHabitIdForFailure(null);
  };

  const onCancelFailure = () => {
    setHabitIdForFailure(null);
  };

  return (
    <>
      <Card>
        <HabitTrackerHeader totalHabits={totalCount} isLoading={showLoading} />
        <CardContent>
          {showLoading ? (
            <LoadingState />
          ) : (
            <>
              {error ? (
                <ErrorState error={error} />
              ) : habits.length === 0 ? (
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
            </>
          )}
        </CardContent>
      </Card>
      
      <FailureDialog
        habitId={habitIdForFailure || ""}
        habitName={habitNameForFailure}
        open={!!habitIdForFailure}
        onOpenChange={(open) => {
          if (!open) setHabitIdForFailure(null);
        }}
        onConfirm={onConfirmFailure}
        onCancel={onCancelFailure}
      />
    </>
  );
}
