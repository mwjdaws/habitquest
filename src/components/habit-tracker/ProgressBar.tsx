
type ProgressBarProps = {
  progress: number;
  completedCount: number;
  totalCount: number;
};

export function ProgressBar({ 
  progress, 
  completedCount, 
  totalCount 
}: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{progress}% complete</span>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} habits
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
