
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { HabitFormContainer } from "./habit/HabitFormContainer";
import { Habit } from "@/lib/habitTypes";
import { deleteHabit, archiveHabit } from "@/lib/api/habitCrudAPI";

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
      
      await deleteHabit(habit.id);
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been permanently deleted",
      });
      
      if (onDelete) {
        onDelete();
      } else {
        onSave();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
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
      
      toast({
        title: "Habit archived",
        description: "Your habit has been archived and can be restored later",
      });
      
      if (onDelete) {
        onDelete();
      } else {
        onSave();
      }
    } catch (error) {
      console.error("Error archiving habit:", error);
      toast({
        title: "Error",
        description: "Failed to archive habit",
        variant: "destructive",
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
