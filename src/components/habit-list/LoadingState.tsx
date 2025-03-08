
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      {/* Progress bar skeleton with realistic proportions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      
      {/* Habit items skeletons with varied shapes for more realistic appearance */}
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className={`h-16 ${index === 0 ? 'w-[90%]' : index === 1 ? 'w-[85%]' : 'w-[95%]'} rounded-md`} />
          </div>
        ))}
      </div>
    </div>
  );
}
