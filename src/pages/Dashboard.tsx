
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

// Minimum interval between refreshes (ms)
const REFRESH_COOLDOWN = 3000;

const Dashboard = () => {
  const lastRefreshRef = useRef(Date.now());
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimize refresh data with improved throttling
  const refreshData = useCallback(() => {
    const now = Date.now();
    // Prevent refresh spam with a cooldown
    if (now - lastRefreshRef.current > REFRESH_COOLDOWN) {
      lastRefreshRef.current = now;
      setRefreshKey(prev => prev + 1);
    } else {
      console.log('Refresh throttled, wait a moment before trying again');
    }
  }, []);

  // Load animation state only once
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Memoize stagger delay to prevent recalculation
  const staggerDelay = useMemo(() => 0.1, []);

  // Memoize components to reduce re-renders and apply animations
  const HabitTrackerMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 0 }}
      className="h-full"
    >
      <div className="h-full">
        <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${refreshKey}`} />
      </div>
    </motion.div>
  ), [isLoaded, staggerDelay, refreshData, refreshKey]);

  const TaskStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 1 }}
    >
      <TaskStats />
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const StreakStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 2 }}
    >
      <StreakStats onDataChange={refreshData} />
    </motion.div>
  ), [isLoaded, staggerDelay, refreshData]);

  const UpcomingTasksMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 3 }}
    >
      <UpcomingTasks />
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const GoalsProgressMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 4 }}
    >
      <GoalsProgress />
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const HabitTrendsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 5 }}
    >
      <HabitTrends />
    </motion.div>
  ), [isLoaded, staggerDelay]);

  const JournalStatsMemo = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.4, delay: staggerDelay * 6 }}
    >
      <JournalStats />
    </motion.div>
  ), [isLoaded, staggerDelay]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
