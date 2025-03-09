
interface GoalObjectiveProps {
  objective: string;
  progress: number;
}

export function GoalObjective({ objective, progress }: GoalObjectiveProps) {
  const isComplete = progress >= 100;
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Objective</h4>
      <div className={`p-3 rounded-md bg-muted/50 ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
        {objective}
      </div>
    </div>
  );
}
