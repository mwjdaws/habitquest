
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type FailureReasonsProps = {
  failures: any[];
  loading: boolean;
};

export function FailureReasons({ failures, loading }: FailureReasonsProps) {
  const chartData = useMemo(() => {
    if (failures.length === 0) return [];

    // Count occurrences of each reason
    const reasonCounts = failures.reduce((acc: Record<string, number>, curr) => {
      const reason = curr.reason;
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    // Convert to array for the chart
    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [failures]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (chartData.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No failure data available for the selected period</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="reason" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Number of failures" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
