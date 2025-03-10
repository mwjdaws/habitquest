
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Edit, MoreVertical, Trash } from "lucide-react";
import { Routine } from "@/lib/routineTypes";
import { Habit } from "@/lib/habitTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitItem } from "../habit-tracker/HabitItem";
import { Badge } from "@/components/ui/badge";

interface RoutineCardProps {
  routine: Routine;
  habits: Habit[];
  completions: any[];
  failures: any[];
  expanded?: boolean;
  onToggleExpand?: (id: string) => void;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onCompleteRoutine: (id: string) => void;
  onToggleHabit: (habitId: string) => void;
  onLogFailure: (habitId: string) => void;
  onUndoFailure: (habitId: string) => void;
}

export function RoutineCard({
  routine,
  habits,
  completions,
  failures,
  expanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
  onCompleteRoutine,
  onToggleHabit,
  onLogFailure,
  onUndoFailure,
}: RoutineCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand(routine.id);
    }
  };

  const allCompleted = habits.length > 0 && habits.every(habit => 
    completions.some(c => c.habit_id === habit.id)
  );
  
  const completedCount = habits.filter(habit => 
    completions.some(c => c.habit_id === habit.id)
  ).length;

  const formattedTimeOfDay = routine.time_of_day 
    ? routine.time_of_day.charAt(0).toUpperCase() + routine.time_of_day.slice(1) 
    : null;

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{routine.name}</CardTitle>
            {formattedTimeOfDay && (
              <Badge variant="outline" className="text-xs">
                {formattedTimeOfDay}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleToggleExpand}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(routine)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Routine
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(routine.id)} className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Routine
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {routine.description && (
          <p className="text-sm text-muted-foreground mt-1">{routine.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {completedCount} of {habits.length} habits completed
          </div>
          <Button 
            variant={allCompleted ? "outline" : "default"} 
            size="sm" 
            onClick={() => onCompleteRoutine(routine.id)}
            className="h-8"
            disabled={habits.length === 0}
          >
            <Check className="mr-1 h-4 w-4" />
            {allCompleted ? 'Completed' : 'Complete All'}
          </Button>
        </div>
      </CardContent>
      
      {isExpanded && habits.length > 0 && (
        <div className="px-4 pb-4 space-y-3">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={completions.some(c => c.habit_id === habit.id)}
              isFailed={failures.some(f => f.habit_id === habit.id)}
              onToggle={onToggleHabit}
              onLogFailure={onLogFailure}
              onUndoFailure={onUndoFailure}
            />
          ))}
        </div>
      )}
      
      {isExpanded && habits.length === 0 && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground text-center py-4">
            No habits in this routine yet.
          </p>
        </div>
      )}
    </Card>
  );
}
