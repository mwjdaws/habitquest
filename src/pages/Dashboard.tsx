
import { useState, useCallback, useRef, useEffect } from "react";
import { HabitTracker } from "@/components/HabitTracker";
import { StreakStats } from "@/components/dashboard/StreakStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { HabitTrends } from "@/components/dashboard/HabitTrends";
import { TaskStats } from "@/components/dashboard/TaskStats";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const lastRefreshRef = useRef(Date.now());
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const refreshData = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshRef.current > 3000) {
      lastRefreshRef.current = now;
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const staggerDelay = 0.1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
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
              <TaskStats />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.4, delay: staggerDelay * 2 }}
            >
              <StreakStats onDataChange={refreshData} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.4, delay: staggerDelay * 3 }}
            >
              <UpcomingTasks />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.4, delay: staggerDelay * 4 }}
            >
              <GoalsProgress />
            </motion.div>
          </DashboardGrid>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.4, delay: staggerDelay * 5 }}
          >
            <HabitTrends />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
