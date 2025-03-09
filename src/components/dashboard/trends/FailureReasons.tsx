
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ChartContainer";

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
        count: Number(count) // Ensure count is a number
      }))
      .sort((a, b) => Number(b.count) - Number(a.count)); // Ensure we're comparing numbers
  }, [failures]);

  return (
    <ChartContainer loading={loading} isEmpty={chartData.length === 0} emptyMessage="No failure data available for the selected period">
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
    </ChartContainer>
  );
}
