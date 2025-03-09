
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  // Convert height to a CSS value
  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  
  if (loading) {
    return <Skeleton className={cn("w-full")} style={{ height: heightStyle }} />;
  }

  if (isEmpty) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  return <div className="w-full" style={{ height: heightStyle }}>{children}</div>;
}
