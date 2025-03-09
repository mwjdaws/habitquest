
import { useState } from "react";
import { Goal, KeyResult, useGoals } from "@/hooks/useGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Edit, 
  Trash2, 
  Check,
  MoreHorizontal
} from "lucide-react";
import { KeyResultItem } from "./KeyResultItem";
import { Badge } from "@/components/ui/badge";
import { formatInTorontoTimezone, getCurrentTorontoDate } from "@/lib/dateUtils";
import { GoalEditForm } from "./GoalEditForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface GoalItemProps {
  goal: Goal;
}

export function GoalItem({ goal }: GoalItemProps) {
  const { deleteGoal, updateGoal, completeGoal } = useGoals();
  const [expanded, setExpanded] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Format dates for display with Toronto timezone
  const startDate = new Date(goal.start_date);
  const endDate = new Date(goal.end_date);
  const currentDate = getCurrentTorontoDate();
  const isActive = currentDate >= startDate && currentDate <= endDate;
  const isPast = currentDate > endDate;
  const isComplete = goal.progress >= 100;
  
  const handleDeleteGoal = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log(`GoalItem - Starting delete operation for goal ID: ${goal.id}`);
    
    const { success } = await deleteGoal(goal.id);
    
    setIsDeleting(false);
    
    if (success) {
      toast({
        title: "Goal deleted",
        description: "The goal has been deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCompleteGoal = async () => {
    if (isComplete || isCompleting) return;
    
    setIsCompleting(true);
    const { success } = await completeGoal(goal.id);
    setIsCompleting(false);
    
    if (success) {
      toast({
        title: "Goal completed",
        description: "The goal has been marked as complete",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to complete goal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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

  if (showEditForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalEditForm 
            goal={goal} 
            onSave={updateGoal} 
            onCancel={() => setShowEditForm(false)} 
          />
        </CardContent>
      </Card>
    );
  }

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
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Goal
                </DropdownMenuItem>
                {!isComplete && (
                  <DropdownMenuItem onClick={handleCompleteGoal} disabled={isCompleting}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </DropdownMenuItem>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Goal
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this goal? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteGoal}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="p-0 h-8 w-8"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
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
