
import { useState, useCallback } from "react";
import { HabitTracker } from "@/components/HabitTracker";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

const Dashboard = () => {
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Function to trigger a refresh
  const refreshData = useCallback(() => {
    if (Date.now() - lastRefresh > 3000) { // Debounce refreshes
      setLastRefresh(Date.now());
    }
  }, [lastRefresh]);

  return (
    <DashboardGrid>
      <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${lastRefresh}`} />
      <StreakStats onDataChange={refreshData} />
      <UpcomingTasks />
      <GoalsProgress />
    </DashboardGrid>
  );
};

export default Dashboard;
