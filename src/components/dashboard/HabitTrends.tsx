
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProgressChart } from "./trends/ProgressChart";
import { StreakRecords } from "./trends/StreakRecords";
import { FailureReasons } from "./trends/FailureReasons";
import { useTrendData } from "@/hooks/habit-tracking/useTrendData";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HabitTrends() {
  const [activeTab, setActiveTab] = useState("progress");
  const { 
    habits, 
    completions, 
    failures, 
    streakRecords, 
    loading, 
    timeFilter, 
    setTimeFilter, 
    refreshData 
  } = useTrendData();

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Habit Trends</CardTitle>
        <div className="flex space-x-2">
          <Tabs 
            value={timeFilter} 
            onValueChange={(value) => setTimeFilter(value as "week" | "month" | "all")}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
            <TabsTrigger value="failures">Failure Reasons</TabsTrigger>
          </TabsList>
          <TabsContent value="progress" className="mt-0">
            <ProgressChart habits={habits} completions={completions} loading={loading} />
          </TabsContent>
          <TabsContent value="streaks" className="mt-0">
            <StreakRecords streakRecords={streakRecords} loading={loading} />
          </TabsContent>
          <TabsContent value="failures" className="mt-0">
            <FailureReasons failures={failures} loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
