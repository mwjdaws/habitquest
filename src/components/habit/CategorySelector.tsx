
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { defaultCategories } from "@/lib/habitTypes";

type CategorySelectorProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <div>
      <Label htmlFor="category">Category</Label>
      <Select
        value={selectedCategory || "General"} // Ensure we always have a default value
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {defaultCategories.map((cat) => (
            // Ensure each category is not an empty string
            <SelectItem key={cat} value={cat || "Other"}>
              {cat || "Other"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
