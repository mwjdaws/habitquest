
import { useState } from "react";
import { toast } from "sonner";
import { HabitFormContainer } from "./habit/HabitFormContainer";
import { Habit } from "@/lib/habitTypes";
import { deleteHabit, archiveHabit } from "@/lib/api/habit"; // Updated import path

type HabitFormProps = {
  habit?: Habit;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export function HabitForm({ habit, onSave, onCancel, onDelete }: HabitFormProps) {
  const isEdit = !!habit;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!isEdit || !habit || isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log(`HabitForm - Starting delete operation for habit ID: ${habit.id}`);
      
      const success = await deleteHabit(habit.id);
      
      if (success) {
        toast.error("Habit deleted", {
          description: "Your habit has been permanently deleted",
        });
        
        // Let the parent component know about the deletion
        if (onDelete) {
          onDelete();
        } else {
          onSave();
        }
      } else {
        throw new Error("Failed to delete habit");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit", {
        description: "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    if (!isEdit || !habit || isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log(`HabitForm - Starting archive operation for habit ID: ${habit.id}`);
      
      await archiveHabit(habit.id);
      
      toast.info("Habit archived", {
        description: "Your habit has been archived and can be restored later",
      });
      
      if (onDelete) {
        onDelete();
      } else {
        onSave();
      }
    } catch (error) {
      console.error("Error archiving habit:", error);
      toast.error("Failed to archive habit", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <HabitFormContainer
      habit={habit}
      onSave={onSave}
      onCancel={onCancel}
      onDelete={handleDelete}
      onArchive={handleArchive}
      isProcessing={isProcessing}
    />
  );
}
