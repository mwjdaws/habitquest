
import { useState } from "react";
import { Goal } from "@/hooks/useGoals";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  Check,
  MoreHorizontal
} from "lucide-react";
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
import { toast } from "sonner";

interface GoalItemActionsProps {
  goal: Goal;
  isComplete: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onComplete: () => Promise<void>;
}

export function GoalItemActions({ 
  goal, 
  isComplete, 
  onEdit, 
  onDelete, 
  onComplete 
}: GoalItemActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log(`GoalItemActions - Starting delete operation for goal ID: ${goal.id}`);
    
    try {
      await onDelete();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete goal. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleComplete = async () => {
    if (isComplete || isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      await onComplete();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to complete goal. Please try again.",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Goal
        </DropdownMenuItem>
        {!isComplete && (
          <DropdownMenuItem onClick={handleComplete} disabled={isCompleting}>
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
                onClick={handleDelete}
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
  );
}
