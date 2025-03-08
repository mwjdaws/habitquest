
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHabits, getTodayFormatted, getCompletionsForDate, toggleHabitCompletion } from "@/lib/habits";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/error-utils";
import { HabitCompletion } from "@/lib/habitTypes";
import { HabitItem } from "./habit-list/HabitItem";
import { NewHabitButton } from "./habit-list/NewHabitButton";
import { HabitFormCard } from "./habit-list/HabitFormCard";
import { EmptyState } from "./habit-list/EmptyState";
import { ErrorAlert } from "./habit-list/ErrorAlert";
import { LoadingState } from "./habit-list/LoadingState";

export function HabitList() {
  const [showForm, setShowForm] = useState(false);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      setError(handleError(queryError));
    }
  }, [queryError]);

  const fetchCompletions = async () => {
    try {
      const data = await getCompletionsForDate(today);
      setCompletions(data);
    } catch (error) {
      console.error("Error fetching completions:", error);
      handleError(error, "Failed to load your habit completions");
    }
  };

  useEffect(() => {
    fetchCompletions();
  }, []);

  const handleToggleCompletion = async (habitId: string) => {
    try {
      const isCompleted = completions.some(c => c.habit_id === habitId);
      await toggleHabitCompletion(habitId, today, isCompleted);
      await fetchCompletions();
      refetchHabits();
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      handleError(error, "Failed to update habit status");
    }
  };

  const handleHabitSaved = () => {
    refetchHabits();
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

      {showForm && (
        <HabitFormCard 
          onSave={handleHabitSaved} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {habits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              isCompleted={completions.some(c => c.habit_id === habit.id)} 
              onToggle={handleToggleCompletion}
              onUpdate={refetchHabits}
            />
          ))}
        </div>
      )}
    </div>
  );
}
