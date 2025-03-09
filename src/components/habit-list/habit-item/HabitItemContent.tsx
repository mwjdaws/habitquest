
import { Badge } from "@/components/ui/badge";
import { Tag, Zap } from "lucide-react";
import { Habit } from "@/lib/habitTypes";

type HabitItemContentProps = {
  habit: Habit;
};

export function HabitItemContent({ habit }: HabitItemContentProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">{habit.name}</h3>
        <Badge variant="outline" className="font-normal text-xs">
          <Tag className="h-3 w-3 mr-1" />
          {habit.category}
        </Badge>
        {habit.current_streak > 0 && (
          <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {habit.current_streak} day streak
          </Badge>
        )}
        {habit.longest_streak > 0 && habit.longest_streak > habit.current_streak && (
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
            Best: {habit.longest_streak}
          </Badge>
        )}
      </div>
      {habit.description && (
        <p className="text-sm text-muted-foreground">{habit.description}</p>
      )}
      <div className="flex gap-1 mt-1">
        {habit.frequency.length > 0 ? (
          habit.frequency.map((day) => (
            <span 
              key={day} 
              className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded"
            >
              {day.slice(0, 3)}
            </span>
          ))
        ) : (
          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
            Daily
          </span>
        )}
      </div>
    </div>
  );
}
