
import { Card, CardContent } from "@/components/ui/card";
import { FailureDialog } from "@/components/habit/FailureDialog";
import { useHabitTracking } from "@/hooks/habit-tracking/useHabitTracking";
import { ProgressBar } from "./habit-tracker/ProgressBar";
import { HabitList } from "./habit-tracker/HabitList";
import { HabitTrackerHeader } from "./habit-tracker/HabitTrackerHeader";
import { LoadingState } from "./habit-list/LoadingState";
import { ErrorState } from "./habit-tracker/ErrorState";
import { EmptyState } from "./habit-tracker/EmptyState";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

export function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");
  const [showLoading, setShowLoading] = useState(true);
  const initialFetchCompleted = useRef(false);
  const loadingTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const lastVisibilityChange = useRef<number>(Date.now());
  
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

  // Memoize the retry handler for better error recovery
  const handleRetry = useCallback(() => {
    console.log('Retrying data load after error...');
    toast({
      title: "Refreshing",
      description: "Refreshing your habit data..."
    });
    refreshData(true);
  }, [refreshData]);

  // One-time initial data fetch with proper cleanup and retry capability
  useEffect(() => {
    mountedRef.current = true;
    console.log('HabitTracker mounted, setting up data fetch');
    
    // Force immediate data load on mount
    if (!initialFetchCompleted.current) {
      console.log('Forcing immediate habit data fetch');
      initialFetchCompleted.current = true;
      refreshData(true);
    }
    
    return () => {
      mountedRef.current = false;
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, [refreshData]);

  // Handle loading state transitions with better debouncing
  useEffect(() => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
    }
    
    if (loading) {
      // Only show loading after a small delay to prevent flicker on fast loads
      loadingTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          setShowLoading(true);
        }
      }, 100);
    } else if (isInitialized) {
      // Add a small delay before hiding loading state to prevent flicker
      loadingTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          setShowLoading(false);
        }
      }, 200);
    }
    
    return () => {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, [loading, isInitialized]);

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

  // Render appropriate content based on state
  const renderContent = () => {
    if (showLoading || !isInitialized) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} onRetry={handleRetry} />;
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

  // Force refresh on visibility change (tab becomes active) with debounce
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const timeSinceLastChange = now - lastVisibilityChange.current;
        
        // Only refresh if at least 5 seconds have passed since last visibility change
        if (timeSinceLastChange > 5000 && initialFetchCompleted.current) {
          console.log('Page became visible, refreshing habit data');
          lastVisibilityChange.current = now;
          refreshData(false);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshData]);

  return (
    <>
      <Card className="w-full">
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
