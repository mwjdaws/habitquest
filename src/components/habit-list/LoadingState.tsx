
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="w-full">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      
      <Skeleton className="h-4 w-full mb-4" />
      
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    </div>
  );
}
