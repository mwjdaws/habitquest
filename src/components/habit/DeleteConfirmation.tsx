
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Archive } from "lucide-react";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState<'delete' | 'archive'>('delete');

  const handleConfirm = () => {
    if (action === 'delete') {
      onConfirm();
    } else if (action === 'archive' && onArchive) {
      onArchive();
    }
    setShowConfirm(false);
  };

  const handleDelete = () => {
    setAction('delete');
    setShowConfirm(true);
  };

  const handleArchive = () => {
    setAction('archive');
    setShowConfirm(true);
  };

  return (
    <div>
      {showConfirm ? (
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            {action === 'delete' 
              ? confirmMessage 
              : "Are you sure you want to archive this habit? It will be hidden from view but all data will be preserved."}
          </p>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {action === 'delete' ? (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  {confirmText}
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Confirm Archive
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <Button 
            type="button" 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
          
          {showArchive && onArchive && (
            <Button 
              type="button" 
              variant="outline" 
              className="text-muted-foreground hover:text-muted-foreground"
              onClick={handleArchive}
              disabled={isLoading}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive Habit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
