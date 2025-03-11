
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { isPastDate } from "@/hooks/habit-tracking/utils/commonUtils";
import { getTodayFormatted } from "@/lib/habits";

type FailedStatusProps = {
  habitId: string;
  failureReason: string;
  onUndoFailure: (habitId: string) => Promise<void>;
  selectedDate?: string;
};

export const FailedStatus = memo(function FailedStatus({ 
  habitId, 
  failureReason, 
  onUndoFailure,
  selectedDate = getTodayFormatted()
}: FailedStatusProps) {
  const isPast = isPastDate(selectedDate);
  
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-xs text-red-500 italic">
        {failureReason || "Failed"}
      </div>
      
      {!isPast && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" 
          onClick={() => onUndoFailure(habitId)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="sr-only">Undo skip</span>
        </Button>
      )}
    </motion.div>
  );
});
