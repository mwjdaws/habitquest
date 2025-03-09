
import { Button } from "@/components/ui/button";
import { Check, Trash, Archive, Edit } from "lucide-react";
import { Habit } from "@/lib/habitTypes";

type HabitItemActionsProps = {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onShowArchive: () => void;
  onShowDelete: () => void;
};

export function HabitItemActions({
  habit,
  isCompleted,
  onToggle,
  onEdit,
  onShowArchive,
  onShowDelete
}: HabitItemActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onEdit}
        className="h-8 w-8"
        title="Edit habit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onShowArchive}
        className="h-8 w-8 text-muted-foreground"
        title="Archive habit"
      >
        <Archive className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onShowDelete}
        className="h-8 w-8 text-destructive"
        title="Delete habit"
      >
        <Trash className="h-4 w-4" />
      </Button>
      <Button 
        variant={isCompleted ? "default" : "outline"} 
        size="sm"
        className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
        onClick={() => onToggle(habit.id)}
      >
        {isCompleted && <Check className="mr-1 h-4 w-4" />}
        {isCompleted ? "Done" : "Mark Complete"}
      </Button>
    </div>
  );
}
