
interface GoalObjectiveProps {
  objective: string;
}

export function GoalObjective({ objective }: GoalObjectiveProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Objective</h4>
      <p className="text-sm text-muted-foreground">{objective}</p>
    </div>
  );
}
