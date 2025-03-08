
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFailure } from "@/lib/habitTypes";
import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  failures: HabitFailure[];
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitStatus = memo(function HabitStatus({
  habitId,
  isCompleted,
  isFailed,
  onToggleCompletion,
  onLogFailure,
  failures
}: HabitStatusProps) {
  // Get failure reason if available
  const failureReason = isFailed ? 
    failures.find(f => f.habit_id === habitId)?.reason || "Failed" : 
    null;
  
  // Memoize handlers to prevent new function references on each render
  const handleSkip = useCallback(() => onLogFailure(habitId), [habitId, onLogFailure]);
  const handleToggle = useCallback(() => onToggleCompletion(habitId), [habitId, onToggleCompletion]);
  
  // Animation variants
  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } }
  };
  
  // Early return pattern for improved readability and performance
  if (isFailed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center"
      >
        <X className="mr-1 h-3 w-3" />
        {failureReason}
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <div className="flex gap-1">
        {!isCompleted && (
          <motion.div key="skip-button" {...buttonVariants}>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleSkip}
            >
              <X className="mr-1 h-3 w-3" />
              Skip
            </Button>
          </motion.div>
        )}
        <motion.div 
          key={isCompleted ? "completed-button" : "complete-button"} 
          {...buttonVariants}
        >
          <Button
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
            onClick={handleToggle}
          >
            {isCompleted ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Done
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.isFailed === nextProps.isFailed &&
    prevProps.habitId === nextProps.habitId &&
    // Only compare the relevant failure for this habit
    JSON.stringify(prevProps.failures.find(f => f.habit_id === prevProps.habitId)) === 
    JSON.stringify(nextProps.failures.find(f => f.habit_id === nextProps.habitId));
});
