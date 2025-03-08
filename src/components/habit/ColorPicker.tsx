
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";

const colorOptions = [
  { name: "Purple", value: "habit-purple" },
  { name: "Blue", value: "habit-soft-blue" },
  { name: "Orange", value: "habit-orange" },
];

type ColorPickerProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
};

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div>
      <Label>Color</Label>
      <div className="flex gap-2 mt-2">
        {colorOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
              selectedColor === option.value ? `border-${option.value} ring-2 ring-offset-2` : "border-muted"
            }`}
            style={{ backgroundColor: `var(--${option.value})` }}
            onClick={() => onColorChange(option.value)}
          >
            {selectedColor === option.value && <Check className="h-4 w-4 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
