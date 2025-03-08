
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  Habit, 
  FrequencyType 
} from "@/lib/habits";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { FrequencySelector } from "./habit/FrequencySelector";
import { ColorPicker } from "./habit/ColorPicker";
import { CategorySelector } from "./habit/CategorySelector";
import { DeleteConfirmation } from "./habit/DeleteConfirmation";

type HabitFormProps = {
  habit?: Habit;
  onSave: () => void;
  onCancel: () => void;
};

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [frequency, setFrequency] = useState<string[]>(habit?.frequency || []);
  const [color, setColor] = useState(habit?.color || "habit-purple");
  const [category, setCategory] = useState(habit?.category || "General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getInitialFrequencyType = (): FrequencyType => {
    if (!habit) return "daily";
    if (habit.frequency.length === 0) return "daily";
    if (habit.frequency.length === 7) return "daily";
    if (habit.frequency.length === 1 && habit.frequency.includes("monday")) return "weekly";
    return "custom";
  };
  
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(getInitialFrequencyType());

  const isEdit = !!habit;

  const handleFrequencyTypeChange = (type: FrequencyType) => {
    setFrequencyType(type);
    
    if (type === "daily") {
      setFrequency([]);
    } else if (type === "weekly") {
      setFrequency(["monday"]);
    }
  };

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

      if (isEdit) {
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

  const handleDelete = async () => {
    if (!isEdit) return;
    
    setLoading(true);
    try {
      await deleteHabit(habit.id);
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully",
      });
      onSave();
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
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
      
      <div>
        <Label htmlFor="name">Habit Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What habit do you want to track?"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your habit"
        />
      </div>
      
      <CategorySelector 
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      <FrequencySelector
        frequency={frequency}
        frequencyType={frequencyType}
        onFrequencyChange={setFrequency}
        onFrequencyTypeChange={handleFrequencyTypeChange}
      />

      <ColorPicker 
        selectedColor={color}
        onColorChange={setColor}
      />

      {isEdit && (
        <>
          <Separator />
          <DeleteConfirmation onConfirm={handleDelete} isLoading={loading} />
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
