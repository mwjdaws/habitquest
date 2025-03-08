
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
  const refreshIntervalRef = useRef<number | null>(null);
  
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

  // Force a refresh when the component mounts - with debounce to prevent excessive calls
  useEffect(() => {
    // Clear any existing intervals when component unmounts or remounts
    if (refreshIntervalRef.current) {
      window.clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    // Initial data fetch - with small delay to ensure auth is ready
    const initialLoadTimeout = window.setTimeout(() => {
      console.log('Initial habit data fetch');
      refreshData(true);
      
      // Set up regular refresh interval (every 2 minutes to reduce load)
      refreshIntervalRef.current = window.setInterval(() => {
        console.log('Silent refresh of habit data');
        refreshData(false); // Silent refresh
      }, 120000); // 2 minutes
    }, 500);
    
    return () => {
      window.clearTimeout(initialLoadTimeout);
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [refreshData]);

  // Smoother transition for loading state with improved timing
  useEffect(() => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    
    if (loading && !isInitialized) {
      // Immediately show loading state when loading starts and not initialized
      setShowLoading(true);
    } else if (!loading && isInitialized) {
      // Add a small delay before hiding the loading state
      // to ensure content is fully ready (prevents flash of empty content)
      loadingTimerRef.current = window.setTimeout(() => {
        setShowLoading(false);
      }, 300);
    }
    
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, [loading, isInitialized]);

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
    if (showLoading || !isInitialized) {
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
        <HabitTrackerHeader totalHabits={totalCount} isLoading={showLoading || !isInitialized} />
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
