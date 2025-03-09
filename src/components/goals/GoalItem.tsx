import { useState } from "react";
import { Goal, KeyResult, useGoals } from "@/hooks/useGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { KeyResultItem } from "./KeyResultItem";
import { Badge } from "@/components/ui/badge";
import { formatInTorontoTimezone, getCurrentTorontoDate } from "@/lib/dateUtils";

interface GoalItemProps {
  goal: Goal;
}

export function GoalItem({ goal }: GoalItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format dates for display with Toronto timezone
  const startDate = new Date(goal.start_date);
  const endDate = new Date(goal.end_date);
  const currentDate = getCurrentTorontoDate();
  const isActive = currentDate >= startDate && currentDate <= endDate;
  const isPast = currentDate > endDate;
  
  const getStatusBadge = () => {
    if (isPast) {
      return goal.progress >= 100 ? (
        <Badge className="bg-green-500">Completed</Badge>
      ) : (
        <Badge variant="destructive">Expired</Badge>
      );
    }
    
    if (isActive) {
      return <Badge className="bg-blue-500">Active</Badge>;
    }
    
    return <Badge variant="outline">Upcoming</Badge>;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{goal.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatInTorontoTimezone(startDate, 'MMM d, yyyy')} - {formatInTorontoTimezone(endDate, 'MMM d, yyyy')}
              </span>
              {getStatusBadge()}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="p-0 h-8 w-8"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Objective</h4>
              <p className="text-sm text-muted-foreground">{goal.objective}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Key Results</h4>
              <div className="space-y-3">
                {goal.key_results && goal.key_results.map((keyResult) => (
                  <KeyResultItem 
                    key={keyResult.id} 
                    keyResult={keyResult as KeyResult} 
                    goalProgress={goal.progress}
                    isGoalActive={isActive}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
