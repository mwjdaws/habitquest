
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
  let isDeleting = false; // Add flag to prevent multiple deletes

  const handleDelete = async () => {
    if (!isEdit || !habit || isDeleting) return;
    
    isDeleting = true; // Set flag to prevent multiple deletion calls
    
    try {
      console.log("HabitForm - Deleting habit:", habit.id);
      await deleteHabit(habit.id);
      console.log("HabitForm - Habit deleted successfully");
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been permanently deleted",
      });
      
      // Call the appropriate callback
      if (onDelete) {
        console.log("HabitForm - Calling onDelete callback");
        onDelete();
      } else {
        console.log("HabitForm - Calling onSave callback as fallback");
        onSave();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
      isDeleting = false; // Reset the flag on error
    }
  };

  const handleArchive = async () => {
    if (!isEdit || !habit || isDeleting) return;
    
    isDeleting = true; // Set flag to prevent multiple archive calls
    
    try {
      console.log("HabitForm - Archiving habit:", habit.id);
      await archiveHabit(habit.id);
      console.log("HabitForm - Habit archived successfully");
      
      toast({
        title: "Habit archived",
        description: "Your habit has been archived and can be restored later",
      });
      
      // Call the appropriate callback
      if (onDelete) {
        console.log("HabitForm - Calling onDelete callback after archive");
        onDelete();
      } else {
        console.log("HabitForm - Calling onSave callback as fallback after archive");
        onSave();
      }
    } catch (error) {
      console.error("Error archiving habit:", error);
      toast({
        title: "Error",
        description: "Failed to archive habit",
        variant: "destructive",
      });
      isDeleting = false; // Reset the flag on error
    }
  };

  return (
    <HabitFormContainer
      habit={habit}
      onSave={onSave}
      onCancel={onCancel}
      onDelete={handleDelete}
      onArchive={handleArchive}
    />
  );
}
