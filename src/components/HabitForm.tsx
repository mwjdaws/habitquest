
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

  const handleDelete = async () => {
    if (!isEdit || !habit) return;
    
    try {
      console.log("Deleting habit:", habit.id);
      await deleteHabit(habit.id);
      console.log("Habit deleted successfully");
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been permanently deleted",
      });
      
      // Call the onDelete callback if provided, otherwise fall back to onSave
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
    }
  };

  const handleArchive = async () => {
    if (!isEdit || !habit) return;
    
    try {
      console.log("Archiving habit:", habit.id);
      await archiveHabit(habit.id);
      console.log("Habit archived successfully");
      
      toast({
        title: "Habit archived",
        description: "Your habit has been archived and can be restored later",
      });
      
      // Call the onDelete callback if provided, otherwise fall back to onSave
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
