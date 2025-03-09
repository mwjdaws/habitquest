
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { Habit } from "@/lib/habitTypes";
import { archiveHabit } from "@/lib/api/habit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

type ArchiveDialogProps = {
  habit: Habit;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onArchive: () => void;
};

export function ArchiveDialog({
  habit,
  isOpen,
  setIsOpen,
  isProcessing,
  setIsProcessing,
  onArchive
}: ArchiveDialogProps) {
  const handleQuickArchive = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    try {
      console.log(`Starting archiving of habit ID: ${habit.id}`);
      await archiveHabit(habit.id);
      console.log(`Successfully archived habit ID: ${habit.id}`);
      
      toast({
        title: "Habit archived",
        description: "Your habit has been archived and can be restored later",
      });
      
      setIsOpen(false);
      onArchive();
    } catch (error) {
      console.error("Error archiving habit:", error);
      toast({
        title: "Error",
        description: "Failed to archive habit",
        variant: "destructive",
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
          <DialogTitle>Archive Habit</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive "{habit.name}"? It will be hidden from view but all data will be preserved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleQuickArchive}
            disabled={isProcessing}
          >
            <Archive className="mr-2 h-4 w-4" />
            {isProcessing ? "Archiving..." : "Archive Habit"}
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
