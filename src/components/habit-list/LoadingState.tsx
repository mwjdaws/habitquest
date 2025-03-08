
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
