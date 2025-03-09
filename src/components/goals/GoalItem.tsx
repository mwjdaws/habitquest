
import { useState } from "react";
import { Goal, KeyResult, useGoals } from "@/hooks/useGoals";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GoalEditForm } from "./GoalEditForm";
import { toast } from "@/components/ui/use-toast";
import { GoalHeader } from "./goal-item/GoalHeader";
import { GoalProgress } from "./goal-item/GoalProgress";
import { GoalItemActions } from "./goal-item/GoalItemActions";
import { GoalObjective } from "./goal-item/GoalObjective";
import { KeyResultsSection } from "./goal-item/KeyResultsSection";
import { getCurrentTorontoDate } from "@/lib/dateUtils";

interface GoalItemProps {
  goal: Goal;
  onRefresh?: () => void;
}

export function GoalItem({ goal, onRefresh }: GoalItemProps) {
  const { deleteGoal, updateGoal, completeGoal } = useGoals();
  const [expanded, setExpanded] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  const handleDeleteGoal = async () => {
    const { success } = await deleteGoal(goal.id);
    
    if (success) {
      toast({
        title: "Goal deleted",
        description: "The goal has been deleted successfully",
      });
      if (onRefresh) onRefresh();
    }
  };
  
  const handleCompleteGoal = async () => {
    const { success } = await completeGoal(goal.id);
    
    if (success) {
      toast({
        title: "Goal completed",
        description: "The goal has been marked as complete",
      });
      if (onRefresh) onRefresh();
    }
  };

  if (showEditForm) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Edit Goal</h3>
        </CardHeader>
        <CardContent>
          <GoalEditForm 
            goal={goal} 
            onSave={updateGoal} 
            onCancel={() => setShowEditForm(false)} 
          />
        </CardContent>
      </Card>
    );
  }

  const isComplete = goal.progress >= 100;
  const currentDate = getCurrentTorontoDate();
  const isGoalActive = currentDate >= new Date(goal.start_date) && currentDate <= new Date(goal.end_date);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <GoalHeader goal={goal} />
          
          <div className="flex items-center gap-2">
            <GoalItemActions
              goal={goal}
              isComplete={isComplete}
              onEdit={() => setShowEditForm(true)}
              onDelete={handleDeleteGoal}
              onComplete={handleCompleteGoal}
            />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="p-0 h-8 w-8"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <GoalProgress progress={goal.progress} />
        
        {expanded && (
          <div className="mt-4 space-y-4">
            <GoalObjective objective={goal.objective} progress={goal.progress} />
            <KeyResultsSection goal={goal} isGoalActive={isGoalActive} onGoalUpdate={onRefresh} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
