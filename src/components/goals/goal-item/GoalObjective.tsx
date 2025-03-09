
import { cn } from "@/lib/utils";

interface GoalObjectiveProps {
  objective: string;
  progress: number;
}

export function GoalObjective({ objective, progress }: GoalObjectiveProps) {
  // Determine if the goal is in progress, near completion, or complete
  const status = progress >= 100 ? "complete" : progress >= 75 ? "nearComplete" : "inProgress";
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-1 flex items-center">
        Objective
        {status === "complete" && (
          <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
            Completed
          </span>
        )}
        {status === "nearComplete" && (
          <span className="ml-2 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
            Almost there
          </span>
        )}
      </h4>
      <div className={cn(
        "p-3 rounded-md bg-muted/50",
        status === "complete" && "line-through text-green-600",
        status === "nearComplete" && "text-amber-700"
      )}>
        {objective}
      </div>
    </div>
  );
}
