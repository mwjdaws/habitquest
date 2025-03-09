
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Archive } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type DeleteConfirmationProps = {
  onConfirm: () => void;
  onArchive?: () => void;
  isLoading: boolean;
  buttonText?: string;
  confirmText?: string;
  confirmMessage?: string;
  showArchive?: boolean;
};

export function DeleteConfirmation({ 
  onConfirm, 
  onArchive,
  isLoading, 
  buttonText = "Delete Habit",
  confirmText = "Confirm Delete",
  confirmMessage = "Are you sure you want to delete this habit? This action cannot be undone.",
  showArchive = true
}: DeleteConfirmationProps) {
  const [actionType, setActionType] = useState<'delete' | 'archive' | null>(null);

  const handleConfirmDelete = () => {
    onConfirm();
    setActionType(null);
  };

  const handleConfirmArchive = () => {
    if (onArchive) {
      onArchive();
    }
    setActionType(null);
  };

  return (
    <div className="flex gap-2">
      {/* Delete Button with Dialog */}
      <AlertDialog open={actionType === 'delete'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setActionType('delete')}
            disabled={isLoading}
          >
            <Trash className="h-4 w-4 mr-1" />
            {buttonText}
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>{confirmMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Archive Button with Dialog */}
      {showArchive && onArchive && (
        <AlertDialog open={actionType === 'archive'} onOpenChange={(open) => !open && setActionType(null)}>
          <AlertDialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-muted-foreground hover:text-muted-foreground"
              onClick={() => setActionType('archive')}
              disabled={isLoading}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Habit</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive this habit? It will be hidden from view but all data will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmArchive}
                disabled={isLoading}
              >
                {isLoading ? "Archiving..." : "Confirm Archive"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
