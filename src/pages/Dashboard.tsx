
import { useState, useCallback, useRef, useEffect } from "react";
import { HabitTracker } from "@/components/HabitTracker";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  // Use ref for last refresh time to avoid re-renders
  const lastRefreshRef = useRef(Date.now());
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Function to trigger a refresh with debouncing
  const refreshData = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshRef.current > 3000) { // Debounce refreshes
      lastRefreshRef.current = now;
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  // Set isLoaded to true after initial render
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const staggerDelay = 0.1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardGrid>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 0 }}
          >
            <HabitTracker onHabitChange={refreshData} key={`habit-tracker-${refreshKey}`} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 1 }}
          >
            <StreakStats onDataChange={refreshData} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 2 }}
          >
            <UpcomingTasks />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 3 }}
          >
            <GoalsProgress />
          </motion.div>
        </DashboardGrid>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
