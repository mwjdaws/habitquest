
import { useState, useCallback, memo } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { useHabitInitialization } from "@/hooks/habit-tracking/useHabitInitialization";
import { AuthRequiredState } from "./habit-tracker/AuthRequiredState";
import { HabitContent } from "./habit-tracker/HabitContent";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { DateSelector } from "./habit-tracker/DateSelector";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

export const HabitTracker = memo(function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  console.log("[HabitTracker] Component rendering");
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [failureState, setFailureState] = useState<{
    habitId: string | null;
    habitName: string;
  }>({ habitId: null, habitName: "" });
  
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
    isInitialized,
    selectedDate,
    setSelectedDate,
    isToday
  } = useHabitTracking(onHabitChange);

  // Use the initialization hook
  useHabitInitialization(isAuthenticated, habits, loading, refreshData);
  
  const handleRetry = useCallback(() => {
    if (isAuthenticated) {
      toast({ title: "Refreshing", description: "Refreshing your habit data..." });
      console.log("[HabitTracker] Manual refresh requested by user");
      refreshData(true);
    }
  }, [refreshData, isAuthenticated]);

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

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, [setSelectedDate]);

  if (!isAuthenticated && !loading) {
    return <AuthRequiredState />;
  }

  return (
    <>
      {isAuthenticated && isInitialized && (
        <DateSelector 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange} 
          isToday={isToday} 
        />
      )}
      
      <HabitContent
        loading={loading}
        error={error}
        isInitialized={isInitialized}
        totalCount={totalCount}
        habits={habits}
        completions={completions}
        failures={failures}
        progress={progress}
        completedCount={completedCount}
        onToggleCompletion={handleToggleCompletion}
        onLogFailure={onLogFailure}
        onUndoFailure={handleUndoFailure}
        onRetry={handleRetry}
      />
      
      <FailureDialog
        habitId={failureState.habitId || ""}
        habitName={failureState.habitName}
        open={!!failureState.habitId}
        onOpenChange={handleDialogOpenChange}
        onConfirm={onConfirmFailure}
        onCancel={onCancelFailure}
      />
    </>
  );
});
