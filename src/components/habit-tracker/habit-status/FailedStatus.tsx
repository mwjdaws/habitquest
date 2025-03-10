
import { X, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { memo, useCallback, useMemo } from "react";

/**
 * Props for the FailedStatus component
 * 
 * @typedef {Object} FailedStatusProps
 * @property {string} habitId - ID of the failed habit
 * @property {string} failureReason - Text description of why the habit failed
 * @property {function} onUndoFailure - Callback to undo the failed status
 */
type FailedStatusProps = {
  habitId: string;
  failureReason: string;
  onUndoFailure: (habitId: string) => Promise<void>;
};

// Animation variants consistent with parent component
const buttonVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Displays a failed habit status with the failure reason and undo button
 * 
 * This component is optimized for performance with memoization to prevent
 * unnecessary re-renders when parent components update.
 * 
 * @param {FailedStatusProps} props - Component props
 * @returns {JSX.Element} Memoized component
 */
export const FailedStatus = memo(function FailedStatus({
  habitId,
  failureReason,
  onUndoFailure,
}: FailedStatusProps) {
  // Memoize handlers to prevent new function references on each render
  const handleUndo = useCallback(() => onUndoFailure(habitId), [habitId, onUndoFailure]);
  
  // Memoize motion components to prevent recreation on each render
  const motionProps = useMemo(() => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  }), []);
  
  return (
    <motion.div 
      {...motionProps}
      className="flex items-center gap-2"
    >
      <motion.div 
        className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md flex items-center"
      >
        <X className="mr-1 h-3 w-3" />
        {failureReason}
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
});
