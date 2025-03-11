
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { HabitTracker } from "@/components/HabitTracker";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { HabitTrends } from "@/components/dashboard/HabitTrends";
import { TaskStats } from "@/components/dashboard/TaskStats";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { JournalStats } from "@/components/dashboard/JournalStats";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

// Minimum interval between refreshes (ms)
const REFRESH_COOLDOWN = 3000;

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const lastRefreshRef = useRef(Date.now());
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimize refresh data with improved throttling
  const refreshData = useCallback(() => {
    if (!user) return; // Skip if not authenticated
    
    const now = Date.now();
    // Prevent refresh spam with a cooldown
    if (now - lastRefreshRef.current > REFRESH_COOLDOWN) {
      lastRefreshRef.current = now;
      setRefreshKey(prev => prev + 1);
    } else {
      console.log('Refresh throttled, wait a moment before trying again');
    }
  }, [user]);

  // Load animation state only once
  useEffect(() => {
    if (!authLoading) {
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [authLoading]);

  // Memoize stagger delay to prevent recalculation
  const staggerDelay = useMemo(() => 0.1, []);

  // Memoize components to reduce re-renders and apply animations
  const HabitTrackerMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 0 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${refreshKey}`} />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay, refreshData, refreshKey]);

  const TaskStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 1 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <TaskStats />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const StreakStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 2 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <StreakStats onDataChange={refreshData} />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay, refreshData]);

  const UpcomingTasksMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 3 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <UpcomingTasks />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const GoalsProgressMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 4 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <GoalsProgress />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const HabitTrendsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 5 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <HabitTrends />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const JournalStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 6 }}
      className="h-full overflow-auto"
    >
      <div className="h-full p-2">
        <JournalStats />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="dashboard-container"
      >
        <DashboardGrid>
          {HabitTrackerMemo}
          {TaskStatsMemo}
          {StreakStatsMemo}
          {UpcomingTasksMemo}
          {GoalsProgressMemo}
          {HabitTrendsMemo}
          {JournalStatsMemo}
        </DashboardGrid>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
