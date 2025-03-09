
import { ColorPicker } from "@/components/habit/ColorPicker";

type HabitAppearanceFieldsProps = {
  color: string;
  setColor: (color: string) => void;
};

export function HabitAppearanceFields({
  color,
  setColor
}: HabitAppearanceFieldsProps) {
  return (
    <ColorPicker 
      selectedColor={color}
      onColorChange={setColor}
    />
  );
}
