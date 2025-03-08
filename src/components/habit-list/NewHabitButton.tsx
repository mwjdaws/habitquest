
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type NewHabitButtonProps = {
  onClick: () => void;
};

export function NewHabitButton({ onClick }: NewHabitButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      New Habit
    </Button>
  );
}
