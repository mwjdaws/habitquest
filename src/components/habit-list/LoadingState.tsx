
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4 w-full">
      {/* Progress bar skeleton with realistic proportions */}
      <div className="mb-6 w-full">
        <div className="flex justify-between items-center mb-2 w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      
      {/* Habit items skeletons with varied shapes for more realistic appearance */}
      <div className="space-y-3 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center w-full">
            <Skeleton className={`h-16 ${index === 0 ? 'w-full' : index === 1 ? 'w-[95%]' : 'w-[98%]'} rounded-md`} />
          </div>
        ))}
      </div>
    </div>
  );
}
