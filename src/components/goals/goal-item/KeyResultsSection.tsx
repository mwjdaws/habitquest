
import { KeyResult, Goal } from "@/hooks/useGoals";
import { KeyResultItem } from "../KeyResultItem";

interface KeyResultsSectionProps {
  goal: Goal;
  isGoalActive: boolean;
}

export function KeyResultsSection({ goal, isGoalActive }: KeyResultsSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Key Results</h4>
      <div className="space-y-3">
        {goal.key_results && goal.key_results.map((keyResult) => (
          <KeyResultItem 
            key={keyResult.id} 
            keyResult={keyResult as KeyResult} 
            goalProgress={goal.progress}
            isGoalActive={isGoalActive}
          />
        ))}
      </div>
    </div>
  );
}
