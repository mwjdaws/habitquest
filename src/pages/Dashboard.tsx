
import { useState, useCallback, useRef } from "react";
import { HabitTracker } from "@/components/HabitTracker";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

const Dashboard = () => {
  // Use ref for last refresh time to avoid re-renders
  const lastRefreshRef = useRef(Date.now());
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Function to trigger a refresh with debouncing
  const refreshData = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshRef.current > 3000) { // Debounce refreshes
      lastRefreshRef.current = now;
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  return (
    <DashboardGrid>
      <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${refreshKey}`} />
      <StreakStats onDataChange={refreshData} />
      <UpcomingTasks />
      <GoalsProgress />
    </DashboardGrid>
  );
};

export default Dashboard;
