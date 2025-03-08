
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHabits, getTodayFormatted, getCompletionsForDate, toggleHabitCompletion } from "@/lib/habits";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/lib/error-utils";
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
  const today = getTodayFormatted();

  const { 
    data: habits = [], 
    isLoading, 
    error: queryError,
    refetch: refetchHabits 
  } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  });

  useEffect(() => {
    if (queryError) {
      setError(handleApiError(queryError, "fetching habits", "Failed to load your habits"));
    }
  }, [queryError]);

  const fetchCompletions = async () => {
    try {
      const data = await getCompletionsForDate(today);
      setCompletions(data);
    } catch (error) {
      console.error("Error fetching completions:", error);
      handleApiError(error, "Failed to load your habit completions", "Failed to load your habit completions");
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, []);

  const handleToggleCompletion = async (habitId: string) => {
    try {
      setIsUpdating(habitId); // Show updating state for this specific habit
      const isCompleted = completions.some(c => c.habit_id === habitId);
      await toggleHabitCompletion(habitId, today, isCompleted);
      await fetchCompletions();
      refetchHabits();
      
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      handleApiError(error, "updating habit status", "Failed to update habit status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleHabitSaved = () => {
    // Immediately refetch habits to ensure the list is up-to-date
    refetchHabits();
    
    // Force a refresh after a short delay to ensure all components have updated
    setTimeout(() => {
      refetchHabits();
    }, 300);
    
    setShowForm(false);
    toast({
      title: "Habit saved",
      description: "Your habit has been saved successfully",
    });
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
                onUpdate={refetchHabits}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
