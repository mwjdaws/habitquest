
import { Card, CardContent } from "@/components/ui/card";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { HabitList } from "./habit-tracker/HabitList";
import { HabitTrackerHeader } from "./habit-tracker/HabitTrackerHeader";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";
import { useState, useCallback, memo, useMemo, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

// Using memo for HabitTracker component to prevent unnecessary re-renders
export const HabitTracker = memo(function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  // Add render counter for debugging
  const renderCount = useRef(0);
  
  // Use a ref to track initialization to prevent multiple data loads
  const isInitializedRef = useRef(false);
  
  // State for failure dialog - local to this component
  const [failureState, setFailureState] = useState<{
    habitId: string | null;
    habitName: string;
  }>({ habitId: null, habitName: "" });
  
  // Use the optimized hook
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
    handleUndoFailure,
    refreshData,
    isInitialized
  } = useHabitTracking(onHabitChange);

  // Initial data load on component mount - only once with better tracking
  useEffect(() => {
    if (!isInitializedRef.current) {
      const timeout = setTimeout(() => {
        console.log("[HabitTracker] Initial mount, triggering data refresh");
        refreshData(true);
        isInitializedRef.current = true;
      }, 200); // Small delay to avoid concurrent rendering issues
      
      return () => clearTimeout(timeout);
    }
  }, [refreshData]); // Added refreshData to dependency array
  
  // Debug render tracking
  useEffect(() => {
    renderCount.current += 1;
    console.log(`[HabitTracker] Render #${renderCount.current}, habits: ${habits.length}, loading: ${loading}`);
  });
  
  // Optimized retry handler with debounce
  const handleRetry = useCallback(() => {
    toast({ title: "Refreshing", description: "Refreshing your habit data..." });
    refreshData(true);
  }, [refreshData]);

  // Memoized handlers for failure dialog
  const onLogFailure = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setFailureState({
        habitId,
        habitName: habit.name
      });
    }
  }, [habits]);

  const onConfirmFailure = useCallback(async (habitId: string, reason: string) => {
    await handleLogFailure(habitId, reason);
    setFailureState({ habitId: null, habitName: "" });
  }, [handleLogFailure]);

  const onCancelFailure = useCallback(() => {
    setFailureState({ habitId: null, habitName: "" });
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setFailureState({ habitId: null, habitName: "" });
  }, []);
  
  // Pre-compute dialog props to reduce re-renders
  const dialogProps = useMemo(() => ({
    habitId: failureState.habitId || "",
    habitName: failureState.habitName,
    open: !!failureState.habitId,
    onOpenChange: handleDialogOpenChange,
    onConfirm: onConfirmFailure,
    onCancel: onCancelFailure
  }), [failureState, handleDialogOpenChange, onConfirmFailure, onCancelFailure]);

  // Debug output to help troubleshoot
  useEffect(() => {
    console.log("[HabitTracker] State update:", {
      habitCount: habits.length,
      isLoading: loading,
      isInitialized,
      hasError: !!error,
      completionsCount: completions.length,
    });
  }, [habits, loading, isInitialized, error, completions]);

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
                onUndoFailure={handleUndoFailure}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <FailureDialog {...dialogProps} />
    </>
  );
});
