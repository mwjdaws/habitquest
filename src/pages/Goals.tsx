
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalsList } from "@/components/goals/GoalsList";
import { useGoals } from "@/hooks/useGoals";

const Goals = () => {
  const [showForm, setShowForm] = useState(false);
  const { goals, loading, error, refreshGoals } = useGoals();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleGoalCreated = () => {
    setShowForm(false);
    refreshGoals();
    toast({
      title: "Success",
      description: "Goal created successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Goals</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create Goal
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set objectives and key results for your personal and professional growth</CardDescription>
          </CardHeader>
          <CardContent>
            <GoalForm onGoalCreated={handleGoalCreated} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <GoalsList goals={goals} loading={loading} onRefresh={refreshGoals} />
      )}
    </div>
  );
};

export default Goals;
