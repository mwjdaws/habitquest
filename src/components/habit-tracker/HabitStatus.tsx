
import { Check, Undo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitFailure } from "@/lib/habitTypes";
import { memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HabitStatusProps = {
  habitId: string;
  isCompleted: boolean;
  isFailed: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  failures: HabitFailure[];
};

// Predefine animation variants outside component to avoid object creation on each render
const buttonVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } }
};

// Using memo with custom comparison to prevent unnecessary re-renders
export const HabitStatus = memo(function HabitStatus({
  habitId,
  isCompleted,
  isFailed,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  failures
}: HabitStatusProps) {
  // Get failure reason if available - using useMemo for consistency
  const failureInfo = useMemo(() => {
    if (!isFailed) return null;
    // Find only runs when needed
    const failure = failures.find(f => f.habit_id === habitId);
    return failure ? failure.reason || "Failed" : "Failed";
  }, [isFailed, failures, habitId]);
  
  // Memoize handlers to prevent new function references on each render
  const handleSkip = useCallback(() => onLogFailure(habitId), [habitId, onLogFailure]);
  const handleToggle = useCallback(() => onToggleCompletion(habitId), [habitId, onToggleCompletion]);
  const handleUndo = useCallback(() => onUndoFailure(habitId), [habitId, onUndoFailure]);
  
  // Early return pattern for improved rendering performance
  if (isFailed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <motion.div 
          className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center"
        >
          <X className="mr-1 h-3 w-3" />
          {failureInfo}
        </motion.div>
        <motion.div {...buttonVariants}>
          <Button
            variant="outline"
            size="sm"
            className="text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            onClick={handleUndo}
          >
            <Undo className="mr-1 h-3 w-3" />
            Undo
          </Button>
        </motion.div>
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
  // Optimized comparison logic that short-circuits early
  if (prevProps.habitId !== nextProps.habitId) return false;
  if (prevProps.isCompleted !== nextProps.isCompleted) return false;
  if (prevProps.isFailed !== nextProps.isFailed) return false;
  
  // Only compare the relevant failure when needed
  if (prevProps.isFailed && nextProps.isFailed) {
    const prevFailure = prevProps.failures.find(f => f.habit_id === prevProps.habitId);
    const nextFailure = nextProps.failures.find(f => f.habit_id === nextProps.habitId);
    return prevFailure?.reason === nextFailure?.reason;
  }
  
  // If we get here, other props are unchanged
  return true;
});
