
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  createHabit, 
  updateHabit
} from "@/lib/api/habit"; // Updated import path
import { Habit } from "@/lib/habitTypes";
import { HabitBasicFields } from "./form-fields/HabitBasicFields";
import { HabitFrequencyFields } from "./form-fields/HabitFrequencyFields";
import { HabitAppearanceFields } from "./form-fields/HabitAppearanceFields";
import { DeleteConfirmation } from "./DeleteConfirmation";

type HabitFormContainerProps = {
  habit?: Habit;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  isProcessing?: boolean;
};

export function HabitFormContainer({ 
  habit, 
  onSave, 
  onCancel, 
  onDelete,
  onArchive,
  isProcessing = false
}: HabitFormContainerProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [frequency, setFrequency] = useState<string[]>(habit?.frequency || []);
  const [color, setColor] = useState(habit?.color || "habit-purple");
  const [category, setCategory] = useState(habit?.category || "General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEdit = !!habit;
  const isSubmitting = loading || isProcessing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      toast.error("Error", {
        description: "Habit name is required",
      });
      return;
    }

    setLoading(true);
    try {
      const habitData = {
        name,
        description: description || null,
        frequency,
        color,
        category
      };

      if (isEdit && habit) {
        await updateHabit(habit.id, habitData);
        toast.success("Habit updated", {
          description: "Your changes have been saved",
        });
      } else {
        await createHabit(habitData);
        toast.success("Habit created", {
          description: "Your new habit has been created",
        });
      }
      onSave();
    } catch (error) {
      console.error("Error saving habit:", error);
      setError(error instanceof Error ? error.message : "Failed to save habit");
      toast.error("Error", {
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} habit`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-900 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <HabitBasicFields 
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
      />

      <HabitFrequencyFields 
        frequency={frequency}
        setFrequency={setFrequency}
      />

      <HabitAppearanceFields 
        color={color}
        setColor={setColor}
      />

      {isEdit && (
        <>
          <Separator />
          <DeleteConfirmation 
            onConfirm={onDelete || (() => {})} 
            onArchive={onArchive}
            isLoading={isSubmitting} 
          />
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Update Habit" : "Save Habit"}
        </Button>
      </div>
    </form>
  );
}
