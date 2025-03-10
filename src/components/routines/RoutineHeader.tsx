
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoutineHeaderProps {
  onCreateRoutine: () => void;
}

export function RoutineHeader({ onCreateRoutine }: RoutineHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">My Routines</h2>
      <Button onClick={onCreateRoutine} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        <span>New Routine</span>
      </Button>
    </div>
  );
}
