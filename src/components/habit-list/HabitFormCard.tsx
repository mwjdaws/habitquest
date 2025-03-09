
import { HabitForm } from "@/components/HabitForm";
import { Card, CardContent } from "@/components/ui/card";

interface HabitFormCardProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function HabitFormCard({ onSave, onCancel, onDelete }: HabitFormCardProps) {
  return (
    <Card className="border-2 border-primary/10 bg-muted/30">
      <CardContent className="pt-6">
        <HabitForm 
          onSave={onSave} 
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}
