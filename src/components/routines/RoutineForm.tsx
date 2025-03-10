
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Habit } from "@/lib/habitTypes";
import { Routine } from "@/lib/routineTypes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits } from "@/hooks/useHabits";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  time_of_day: z.string().optional(),
  habit_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoutineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: Routine & { habitIds?: string[] };
  onSubmit: (values: FormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const timeOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
];

export function RoutineForm({
  open,
  onOpenChange,
  routine,
  onSubmit,
  onDelete,
}: RoutineFormProps) {
  const { habits, loading } = useHabits();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: routine?.name || "",
      description: routine?.description || "",
      time_of_day: routine?.time_of_day || "",
      habit_ids: routine?.habitIds || [],
    },
  });

  useEffect(() => {
    if (routine) {
      form.reset({
        name: routine.name,
        description: routine.description || "",
        time_of_day: routine.time_of_day || "",
        habit_ids: routine.habitIds || [],
      });
      setSelectedHabits(routine.habitIds || []);
    } else {
      form.reset({
        name: "",
        description: "",
        time_of_day: "",
        habit_ids: [],
      });
      setSelectedHabits([]);
    }
  }, [routine, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit({
        ...values,
        habit_ids: selectedHabits,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting routine:", error);
    }
  };

  const handleHabitToggle = (habitId: string, checked: boolean) => {
    if (checked) {
      setSelectedHabits((prev) => [...prev, habitId]);
    } else {
      setSelectedHabits((prev) => prev.filter((id) => id !== habitId));
    }
  };

  const removeHabit = (habitId: string) => {
    setSelectedHabits((prev) => prev.filter((id) => id !== habitId));
  };

  const filteredHabits = habits.filter(habit => !habit.archived);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{routine ? "Edit Routine" : "Create Routine"}</DialogTitle>
          <DialogDescription>
            {routine
              ? "Update your routine details and manage associated habits."
              : "Create a new routine to group your habits."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning Routine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of this routine"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_of_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time of day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Associated Habits</FormLabel>
              
              {/* Selected Habits */}
              {selectedHabits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedHabits.map(habitId => {
                    const habit = filteredHabits.find(h => h.id === habitId);
                    if (!habit) return null;
                    
                    return (
                      <div 
                        key={habitId}
                        className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                        style={{ backgroundColor: `var(--${habit.color})`, color: "white" }}
                      >
                        <span className="mr-1">{habit.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full text-white hover:bg-white/20 hover:text-white"
                          onClick={() => removeHabit(habitId)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading habits...</div>
              ) : filteredHabits.length === 0 ? (
                <div className="text-sm text-muted-foreground">No habits available</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {filteredHabits.map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`habit-${habit.id}`}
                        checked={selectedHabits.includes(habit.id)}
                        onCheckedChange={(checked) =>
                          handleHabitToggle(habit.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`habit-${habit.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {habit.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              {routine && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              )}
              <Button type="submit" className="w-full sm:w-auto">
                {routine ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
