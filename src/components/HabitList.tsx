import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompletionsForDate, toggleHabitCompletion, getTodayFormatted } from "@/lib/habits";
import { fetchHabits } from "@/lib/api/habit";
import { toast } from "@/components/ui/use-toast";
import { formatErrorMessage, getUserFriendlyErrorMessage } from "@/lib/error-utils";
import { HabitCompletion } from "@/lib/habitTypes";
import { HabitItem } from "./habit-list/HabitItem";
import { NewHabitButton } from "./habit-list/NewHabitButton";
import { HabitFormCard } from "./habit-list/HabitFormCard";
import { EmptyState } from "./habit-list/EmptyState";
import { ErrorAlert } from "./habit-list/ErrorAlert";
import { LoadingState } from "./habit-list/LoadingState";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function HabitList() {
  const [showForm, setShowForm] = useState(false);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const today = getTodayFormatted();
  const queryClient = useQueryClient();

  const { 
    data: habits = [], 
    isLoading, 
    error: queryError,
    refetch: refetchHabits 
  } = useQuery({
    queryKey: ['habits', refreshCounter],
    queryFn: () => fetchHabits(false),
  });

  useEffect(() => {
    if (queryError) {
      const errorMessage = formatErrorMessage(queryError);
      setError(errorMessage);
    }
  }, [queryError]);

  const fetchCompletions = async () => {
    try {
      console.log("Fetching completions for date:", today);
      const data = await getCompletionsForDate(today);
      console.log("Received completions:", data);
      setCompletions(data);
    } catch (error) {
      console.error("Error fetching completions:", error);
      const errorMessage = formatErrorMessage(error);
      console.error("Error fetching completions:", errorMessage);
      setError(getUserFriendlyErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, [refreshCounter]);

  const refreshAllData = useCallback(async () => {
    console.log("Refreshing all habit data...");
    
    queryClient.invalidateQueries({ queryKey: ['habits'] });
    setRefreshCounter(prev => prev + 1);
    
    try {
      await Promise.all([
        refetchHabits(),
        fetchCompletions()
      ]);
      console.log("All habit data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing habit data:", error);
    }
  }, [refetchHabits, queryClient]);

  const handleToggleCompletion = async (habitId: string) => {
    try {
      setIsUpdating(habitId);
      const isCompleted = completions.some(c => c.habit_id === habitId);
      await toggleHabitCompletion(habitId, today, isCompleted);
      await fetchCompletions();
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error updating habit status:", errorMessage);
      
      toast({
        title: "Error",
        description: getUserFriendlyErrorMessage(error) || "Failed to update habit status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleHabitSaved = async () => {
    await refreshAllData();
    setShowForm(false);
    toast({
      title: "Habit saved",
      description: "Your habit has been saved successfully",
    });
  };

  const handleHabitDeleted = async () => {
    console.log("Habit deleted, refreshing list...");
    
    setTimeout(async () => {
      await refreshAllData();
      setShowForm(false);
      
      toast({
        title: "Habit removed",
        description: "Your habit has been removed successfully",
      });
    }, 300);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <NewHabitButton onClick={() => setShowForm(!showForm)} />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HabitFormCard 
              onSave={handleHabitSaved} 
              onCancel={() => setShowForm(false)}
              onDelete={handleHabitDeleted}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {habits.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                isUpdating === habit.id ? "animate-pulse" : ""
              )}
            >
              <HabitItem 
                habit={habit} 
                isCompleted={completions.some(c => c.habit_id === habit.id)} 
                onToggle={handleToggleCompletion}
                onUpdate={refreshAllData}
                onDelete={handleHabitDeleted}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
