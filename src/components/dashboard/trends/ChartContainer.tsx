
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ChartContainerProps = {
  loading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
  height?: number | string;
  children: ReactNode;
};

/**
 * Reusable container for chart components with standardized loading and empty states
 */
export function ChartContainer({
  loading,
  isEmpty,
  emptyMessage = "No data available for the selected period",
  height = 300,
  children
}: ChartContainerProps) {
  if (loading) {
    return <Skeleton className={`h-[${typeof height === 'number' ? height + 'px' : height}] w-full`} />;
  }

  if (isEmpty) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  return <div className={`h-[${typeof height === 'number' ? height + 'px' : height}] w-full`}>{children}</div>;
}
