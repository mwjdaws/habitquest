
import { X, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";

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

export const FailedStatus = memo(function FailedStatus({
  habitId,
  failureReason,
  onUndoFailure,
}: FailedStatusProps) {
  // Memoize handlers to prevent new function references on each render
  const handleUndo = useCallback(() => onUndoFailure(habitId), [habitId, onUndoFailure]);
  
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
