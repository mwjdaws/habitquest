
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Habit } from "@/lib/habitTypes";
import { deleteHabit } from "@/lib/api/habit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

type DeleteDialogProps = {
  habit: Habit;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onDelete: () => void;
};

export function DeleteDialog({
  habit,
  isOpen,
  setIsOpen,
  isProcessing,
  setIsProcessing,
  onDelete
}: DeleteDialogProps) {
  const handleQuickDelete = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    try {
      console.log(`Starting deletion of habit ID: ${habit.id}`);
      await deleteHabit(habit.id);
      console.log(`Successfully deleted habit ID: ${habit.id}`);
      
      toast.error("Habit deleted", {
        description: "Your habit has been permanently deleted",
        duration: 5000,
      });
      
      setIsOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isProcessing) setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Habit</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{habit.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleQuickDelete}
            disabled={isProcessing}
          >
            <Trash className="mr-2 h-4 w-4" />
            {isProcessing ? "Deleting..." : "Delete Permanently"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isProcessing}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
