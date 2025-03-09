
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useJournalStats } from "@/hooks/useJournalStats";
import { PieChartIcon } from "lucide-react";

export function SentimentDistribution() {
  const { sentimentDistribution, isLoading } = useJournalStats();
  
  // Prepare empty state message
  const isEmpty = sentimentDistribution.length === 0;
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mood Distribution</CardTitle>
        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-[200px] bg-muted rounded-md" />
        ) : isEmpty ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No sentiment data available
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="category"
                  label={(entry) => entry.category}
                  labelLine={false}
                >
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} entries`, name]}
                  contentStyle={{ 
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
