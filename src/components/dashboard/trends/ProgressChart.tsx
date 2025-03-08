
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/habitUtils";

type ProgressChartProps = {
  habits: any[];
  completions: any[];
  loading: boolean;
};

export function ProgressChart({ habits, completions, loading }: ProgressChartProps) {
  const chartData = useMemo(() => {
    if (habits.length === 0 || completions.length === 0) return [];

    // Get the date range
    const dateSet = new Set<string>();
    completions.forEach(c => dateSet.add(c.completed_date));
    const dates = Array.from(dateSet).sort();

    if (dates.length === 0) return [];

    // Create a map of habits by ID for quick lookup
    const habitsMap = new Map(habits.map(h => [h.id, h]));

    // Group completions by date and habit
    const completionsByDate = new Map<string, Set<string>>();
    completions.forEach(c => {
      if (!completionsByDate.has(c.completed_date)) {
        completionsByDate.set(c.completed_date, new Set());
      }
      completionsByDate.get(c.completed_date)?.add(c.habit_id);
    });

    // Create chart data points
    return dates.map(date => {
      const dateCompletions = completionsByDate.get(date) || new Set();
      const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });

      const dataPoint: any = { date: formattedDate };
      
      // Calculate completion rate for each habit
      habits.forEach(habit => {
        const isCompleted = dateCompletions.has(habit.id) ? 1 : 0;
        dataPoint[habit.name] = isCompleted;
      });

      return dataPoint;
    });
  }, [habits, completions]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (chartData.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No data available for the selected period</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} ticks={[0, 1]} />
          <Tooltip />
          <Legend />
          {habits.slice(0, 5).map((habit, index) => (
            <Line
              key={habit.id}
              type="monotone"
              dataKey={habit.name}
              stroke={getColorForIndex(index)}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {habits.length > 5 && (
        <div className="text-sm text-muted-foreground mt-2 text-center">
          Showing top 5 habits. {habits.length - 5} more not shown.
        </div>
      )}
    </div>
  );
}

// Helper function to get colors for the chart lines
function getColorForIndex(index: number): string {
  const colors = [
    "#2563eb", // Blue
    "#16a34a", // Green
    "#d97706", // Amber
    "#dc2626", // Red
    "#7c3aed", // Purple
    "#0891b2", // Cyan
    "#db2777", // Pink
  ];
  return colors[index % colors.length];
}
