import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Trash } from "lucide-react";
import { 
  weekdays, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  Habit, 
  FrequencyType,
  defaultCategories 
} from "@/lib/habits";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const colorOptions = [
  { name: "Purple", value: "habit-purple" },
  { name: "Blue", value: "habit-soft-blue" },
  { name: "Orange", value: "habit-orange" },
];

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
  const [deleteConfirm, setDeleteConfirm] = useState(false);
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

  const handleFrequencyToggle = (day: string) => {
    if (frequency.includes(day)) {
      setFrequency(frequency.filter((d) => d !== day));
    } else {
      setFrequency([...frequency, day]);
    }
  };

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
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {defaultCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Frequency</Label>
        <Tabs 
          value={frequencyType} 
          onValueChange={(value) => handleFrequencyTypeChange(value as FrequencyType)}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <p className="text-sm text-muted-foreground mt-2">
              This habit will be tracked every day
            </p>
          </TabsContent>
          
          <TabsContent value="weekly">
            <p className="text-sm text-muted-foreground mt-2">
              This habit will be tracked every Monday
            </p>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="grid grid-cols-7 gap-1 mt-2">
              {weekdays.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={frequency.includes(day) ? "default" : "outline"}
                  className={`h-9 ${frequency.includes(day) ? "" : "border-dashed"}`}
                  onClick={() => handleFrequencyToggle(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {frequency.length === 0
                ? "Please select at least one day"
                : `Track on selected days (${frequency.length} days)`}
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                color === option.value ? `border-${option.value} ring-2 ring-offset-2` : "border-muted"
              }`}
              style={{ backgroundColor: `var(--${option.value})` }}
              onClick={() => setColor(option.value)}
            >
              {color === option.value && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {isEdit && (
        <>
          <Separator />
          <div>
            {deleteConfirm ? (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this habit? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Confirm Delete
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Habit
              </Button>
            )}
          </div>
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
