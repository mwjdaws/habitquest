
import { Card, CardContent } from "@/components/ui/card";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { useHabitTracking } from "@/hooks/useHabitTracking";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { HabitList } from "./habit-tracker/HabitList";
import { HabitTrackerHeader } from "./habit-tracker/HabitTrackerHeader";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";
import { useState, useEffect, useRef } from "react";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

export function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  const [showLoading, setShowLoading] = useState(true);
  const loadingTimerRef = useRef<number | null>(null);
  
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
    refreshData
  } = useHabitTracking(onHabitChange);

  // Force a refresh when the component mounts
  useEffect(() => {
    // Immediate refresh on mount
    refreshData();
    
    // Set up regular refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      refreshData(false); // Silent refresh
    }, 30000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshData]);

  // Smoother transition for loading state to prevent UI flashing
  useEffect(() => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    
    if (loading) {
      // Immediately show loading state when loading starts
      setShowLoading(true);
    } else {
      // Add a slight delay before hiding the loading state to prevent flickering
      loadingTimerRef.current = window.setTimeout(() => {
        setShowLoading(false);
      }, 500);
    }
    
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
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

  // Show appropriate content based on loading/error state
  const renderContent = () => {
    if (showLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} />;
    }
    
    if (habits.length === 0) {
      return <EmptyState hasHabits={totalCount > 0} />;
    }
    
    return (
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
    );
  };

  return (
    <>
      <Card>
        <HabitTrackerHeader totalHabits={totalCount} isLoading={showLoading} />
        <CardContent>
          {renderContent()}
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
