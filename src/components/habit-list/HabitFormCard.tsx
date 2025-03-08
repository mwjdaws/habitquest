
import { Card, CardContent } from "@/components/ui/card";
import { HabitForm } from "@/components/HabitForm";

type HabitFormCardProps = {
  onSave: () => void;
  onCancel: () => void;
};

export function HabitFormCard({ onSave, onCancel }: HabitFormCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <HabitForm onSave={onSave} onCancel={onCancel} />
      </CardContent>
    </Card>
  );
}
