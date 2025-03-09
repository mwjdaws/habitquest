
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "@/components/habit/CategorySelector";

type HabitBasicFieldsProps = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
};

export function HabitBasicFields({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory
}: HabitBasicFieldsProps) {
  return (
    <>
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
    </>
  );
}
