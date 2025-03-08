
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHabits, getTodayFormatted, getCompletionsForDate, toggleHabitCompletion, Habit, HabitCompletion } from "@/lib/habits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { HabitForm } from "./HabitForm";
import { toast } from "@/components/ui/use-toast";

export function HabitList() {
  const [showForm, setShowForm] = useState(false);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const today = getTodayFormatted();

  const { 
    data: habits = [], 
    isLoading, 
    error,
    refetch: refetchHabits 
  } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  });

  const fetchCompletions = async () => {
    try {
      const data = await getCompletionsForDate(today);
      setCompletions(data);
    } catch (error) {
      console.error("Error fetching completions:", error);
      toast({
        title: "Error",
        description: "Failed to load your habit completions",
        variant: "destructive",
      });
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
      toast({
        title: isCompleted ? "Habit unmarked" : "Habit completed",
        description: isCompleted ? "Keep working on it!" : "Great job!",
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      toast({
        title: "Error",
        description: "Failed to update habit status",
        variant: "destructive",
      });
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

  if (isLoading) return <div className="py-8 text-center">Loading habits...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error loading habits</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <HabitForm onSave={handleHabitSaved} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">You don't have any habits yet. Create your first one!</p>
          </CardContent>
        </Card>
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

function HabitItem({ 
  habit, 
  isCompleted, 
  onToggle, 
  onUpdate 
}: { 
  habit: Habit; 
  isCompleted: boolean; 
  onToggle: (id: string) => void;
  onUpdate: () => void;
}) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleHabitSaved = () => {
    onUpdate();
    setShowEditForm(false);
  };

  return (
    <Card className={`border-l-4 border-l-${habit.color}`}>
      {showEditForm ? (
        <CardContent className="pt-6">
          <HabitForm 
            habit={habit} 
            onSave={handleHabitSaved} 
            onCancel={() => setShowEditForm(false)} 
          />
        </CardContent>
      ) : (
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
            <div className="flex gap-1 mt-1">
              {habit.frequency.length > 0 ? (
                habit.frequency.map((day) => (
                  <span 
                    key={day} 
                    className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                  >
                    {day.slice(0, 3)}
                  </span>
                ))
              ) : (
                <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                  Daily
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEditForm(true)}
            >
              Edit
            </Button>
            <Button 
              variant={isCompleted ? "default" : "outline"} 
              size="sm"
              className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
              onClick={() => onToggle(habit.id)}
            >
              {isCompleted && <Check className="mr-1 h-4 w-4" />}
              {isCompleted ? "Done" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
