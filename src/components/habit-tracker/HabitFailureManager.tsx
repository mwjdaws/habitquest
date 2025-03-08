
import { useState } from "react";
import { FailureDialog } from "@/components/habit/FailureDialog";

type HabitFailureManagerProps = {
  onConfirmFailure: (habitId: string, reason: string) => Promise<void>;
  habits: any[];
};

export function HabitFailureManager({ onConfirmFailure, habits }: HabitFailureManagerProps) {
  const [habitIdForFailure, setHabitIdForFailure] = useState<string | null>(null);
  const [habitNameForFailure, setHabitNameForFailure] = useState<string>("");

  const handleLogFailure = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setHabitIdForFailure(habitId);
      setHabitNameForFailure(habit.name);
    }
  };

  const handleConfirmFailure = async (habitId: string, reason: string) => {
    await onConfirmFailure(habitId, reason);
    setHabitIdForFailure(null);
  };

  const handleCancelFailure = () => {
    setHabitIdForFailure(null);
  };

  return {
    handleLogFailure,
    dialogProps: {
      habitId: habitIdForFailure || "",
      habitName: habitNameForFailure,
      open: !!habitIdForFailure,
      onOpenChange: (open: boolean) => {
        if (!open) setHabitIdForFailure(null);
      },
      onConfirm: handleConfirmFailure,
      onCancel: handleCancelFailure,
    }
  };
}
