
import { Progress } from "@/components/ui/progress";

interface GoalProgressProps {
  progress: number;
}

export function GoalProgress({ progress }: GoalProgressProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
