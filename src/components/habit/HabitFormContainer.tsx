import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  createHabit, 
  updateHabit
} from "@/lib/api/habitCrudAPI";
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
};

export function HabitFormContainer({ 
  habit, 
  onSave, 
  onCancel, 
  onDelete,
  onArchive
}: HabitFormContainerProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [frequency, setFrequency] = useState<string[]>(habit?.frequency || []);
  const [color, setColor] = useState(habit?.color || "habit-purple");
  const [category, setCategory] = useState(habit?.category || "General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEdit = !!habit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Habit name is required",
        variant: "destructive",
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
      } else {
        await createHabit(habitData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving habit:", error);
      setError(error instanceof Error ? error.message : "Failed to save habit");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} habit`,
        variant: "destructive",
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
            onConfirm={onDelete} 
            onArchive={onArchive}
            isLoading={loading} 
          />
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Habit" : "Save Habit"}
        </Button>
      </div>
    </form>
  );
}
