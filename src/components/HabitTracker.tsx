
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
import { Button } from "@/components/ui/button";
import { LogIn, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HabitTrackerProps {
  onHabitChange?: () => void;
}

// Using memo for HabitTracker component to prevent unnecessary re-renders
export const HabitTracker = memo(function HabitTracker({ onHabitChange }: HabitTrackerProps) {
  console.log("[HabitTracker] Component rendering");
  const { user } = useAuth(); // Use Auth context directly for auth state
  const isAuthenticated = !!user;
  
  // State for failure dialog - local to this component
  const [failureState, setFailureState] = useState<{
    habitId: string | null;
    habitName: string;
  }>({ habitId: null, habitName: "" });
  
  const didInitialRefreshRef = useRef(false);
  const dataFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Initial data load on component mount - force a refresh on mount
  useEffect(() => {
    if (isAuthenticated && !didInitialRefreshRef.current) {
      console.log("[HabitTracker] Component mounted, initializing data");
      didInitialRefreshRef.current = true;
      
      // Clear any existing timeout
      if (dataFetchTimeoutRef.current) {
        clearTimeout(dataFetchTimeoutRef.current);
      }
      
      // Delay slightly to avoid race conditions during initial mounting
      dataFetchTimeoutRef.current = setTimeout(() => {
        console.log("[HabitTracker] Triggering initial data refresh");
        refreshData(true, true); // Force loading indicator and refresh
      }, 200);
    }
    
    return () => {
      if (dataFetchTimeoutRef.current) {
        clearTimeout(dataFetchTimeoutRef.current);
      }
    };
  }, [refreshData, isAuthenticated]);
  
  // Add an effect to retry if auth state changes after mount
  useEffect(() => {
    if (isAuthenticated && didInitialRefreshRef.current && !habits.length && !loading) {
      console.log("[HabitTracker] Auth state changed, retrying data fetch");
      refreshData(true, true);
    }
  }, [isAuthenticated, habits.length, loading, refreshData]);
  
  // Optimized retry handler
  const handleRetry = useCallback(() => {
    if (isAuthenticated) {
      toast({ title: "Refreshing", description: "Refreshing your habit data..." });
      console.log("[HabitTracker] Manual refresh requested by user");
      refreshData(true, true);
    }
  }, [refreshData, isAuthenticated]);

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

  console.log("[HabitTracker] Rendering with", {
    loading,
    isInitialized,
    isAuthenticated,
    habitsCount: habits?.length || 0,
    error: error ? 'Error exists' : 'No error'
  });

  // Show auth required state if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <Card className="w-full">
        <HabitTrackerHeader totalHabits={0} isLoading={false} />
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-center mb-4">
            You need to be signed in to view and track your habits.
          </p>
          <Button asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // More efficient content rendering with early returns
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
          <ErrorState error={error} onRetry={handleRetry} />
        </CardContent>
      </Card>
    );
  }

  // Add retry button if no habits loaded but user is authenticated
  if (isAuthenticated && habits.length === 0 && isInitialized) {
    return (
      <Card className="w-full">
        <HabitTrackerHeader totalHabits={totalCount} isLoading={false} />
        <CardContent>
          <EmptyState hasHabits={totalCount > 0} />
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry loading habits
            </Button>
          </div>
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
