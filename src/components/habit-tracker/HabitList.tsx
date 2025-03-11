
import { memo } from "react";
import { Habit, HabitCompletion, HabitFailure } from "@/lib/habitTypes";
import { HabitItem } from "./HabitItem";
import { AnimatePresence, motion } from "framer-motion";
import { getTodayFormatted } from "@/lib/habits";

interface HabitListProps {
  habits: Habit[];
  completions: HabitCompletion[];
  failures: HabitFailure[];
  onToggleCompletion: (habitId: string) => Promise<void>;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => Promise<void>;
  selectedDate?: string;
}

export const HabitList = memo(function HabitList({
  habits,
  completions,
  failures,
  onToggleCompletion,
  onLogFailure,
  onUndoFailure,
  selectedDate = getTodayFormatted()
}: HabitListProps) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div 
        className="space-y-3 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <HabitItem
              habit={habit}
              completions={completions}
              failures={failures}
              onToggleCompletion={onToggleCompletion}
              onLogFailure={onLogFailure}
              onUndoFailure={onUndoFailure}
              selectedDate={selectedDate}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});
