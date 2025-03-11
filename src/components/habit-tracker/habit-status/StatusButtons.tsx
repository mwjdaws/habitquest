
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isPastDate } from "@/hooks/habit-tracking/utils/commonUtils";
import { getTodayFormatted } from "@/lib/habits";

/**
 * Props for the StatusButtons component
 * 
 * @typedef {Object} StatusButtonsProps
 * @property {string} habitId - ID of the habit
 * @property {boolean} isCompleted - Whether the habit is completed
 * @property {function} onToggleCompletion - Callback to toggle completion status
 * @property {function} onLogFailure - Callback to mark habit as failed
 * @property {string} [selectedDate] - The currently selected date
 */
type StatusButtonsProps = {
  habitId: string;
  isCompleted: boolean;
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  selectedDate?: string;
};

// Animation variants consistent with parent component
const buttonVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Renders the action buttons for a habit (Complete/Done and Skip)
 * 
 * This component is memoized for performance and uses AnimatePresence
 * for smooth transitions when buttons appear/disappear.
 * 
 * @param {StatusButtonsProps} props - Component props
 * @returns {JSX.Element} Memoized component
 */
export const StatusButtons = memo(function StatusButtons({
  habitId,
  isCompleted,
  onToggleCompletion,
  onLogFailure,
  selectedDate = getTodayFormatted()
}: StatusButtonsProps) {
  // Determine if this is a past date
  const isPast = isPastDate(selectedDate);
  
  // Memoize handlers to prevent new function references on each render
  const handleSkip = useCallback(() => onLogFailure(habitId), [habitId, onLogFailure]);
  const handleToggle = useCallback(() => onToggleCompletion(habitId), [habitId, onToggleCompletion]);
  
  // For past dates, only allow marking incomplete habits as complete, not vice versa
  // For completed habits in the past, we show a disabled "Done" button
  return (
    <AnimatePresence mode="wait">
      <div className="flex gap-1">
        {/* Only show Skip button for today's incomplete habits */}
        {!isCompleted && !isPast && (
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
            disabled={isPast && isCompleted} // Disable if past date and already completed
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
});
