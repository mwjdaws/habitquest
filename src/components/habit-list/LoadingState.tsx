
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function LoadingState() {
  // Staggered animation for skeletons
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4 w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Progress bar skeleton with realistic proportions */}
      <motion.div variants={item} className="mb-6 w-full">
        <div className="flex justify-between items-center mb-2 w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </motion.div>
      
      {/* Habit items skeletons */}
      <div className="space-y-3 w-full">
        {[...Array(3)].map((_, index) => (
          <motion.div 
            key={index} 
            variants={item} 
            className="flex items-center w-full"
          >
            <Skeleton className="h-16 w-full rounded-md" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
