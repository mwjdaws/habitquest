
import { FormFieldComponent } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
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
      <FormFieldComponent
        id="name"
        label="Habit Name"
      >
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What habit do you want to track?"
          required
        />
      </FormFieldComponent>

      <FormFieldComponent
        id="description"
        label="Description (Optional)"
      >
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your habit"
        />
      </FormFieldComponent>
      
      <CategorySelector 
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
    </>
  );
}
