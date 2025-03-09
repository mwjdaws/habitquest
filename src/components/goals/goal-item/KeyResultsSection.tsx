
import { KeyResult, Goal } from "@/hooks/useGoals";
import { KeyResultItem } from "../KeyResultItem";
import { useCallback } from "react";
import { updateGoalProgress } from "@/lib/api/goal";
import { toast } from "@/components/ui/use-toast";

interface KeyResultsSectionProps {
  goal: Goal;
  isGoalActive: boolean;
  onGoalUpdate?: () => void;
}

export function KeyResultsSection({ goal, isGoalActive, onGoalUpdate }: KeyResultsSectionProps) {
  const handleProgressUpdate = useCallback(async (newProgress: number) => {
    if (goal.progress !== newProgress) {
      console.log(`Updating goal progress from ${goal.progress}% to ${newProgress}%`);
      const { success, message } = await updateGoalProgress(goal.id, newProgress);
      
      if (success) {
        toast({
          title: "Progress updated",
          description: message || "Goal progress has been updated",
        });
        
        // Notify parent component about the update
        if (onGoalUpdate) {
          onGoalUpdate();
        }
      }
    }
  }, [goal.id, goal.progress, onGoalUpdate]);

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Key Results</h4>
      <div className="space-y-3">
        {goal.key_results && goal.key_results.length > 0 ? (
          goal.key_results.map((keyResult) => (
            <KeyResultItem 
              key={keyResult.id} 
              keyResult={keyResult as KeyResult} 
              goalProgress={goal.progress}
              isGoalActive={isGoalActive}
              onProgressChange={handleProgressUpdate}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No key results defined</p>
        )}
      </div>
    </div>
  );
}
