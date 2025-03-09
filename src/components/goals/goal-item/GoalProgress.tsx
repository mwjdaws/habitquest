
import { Progress } from "@/components/ui/progress";

interface GoalProgressProps {
  progress: number;
}

export function GoalProgress({ progress }: GoalProgressProps) {
  // Determine color based on progress percentage
  const getProgressColor = (value: number) => {
    if (value >= 100) return "bg-green-500";
    if (value >= 75) return "bg-blue-500";
    if (value >= 50) return "bg-yellow-500";
    if (value >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2" 
        indicatorClassName={getProgressColor(progress)} 
      />
    </div>
  );
}
