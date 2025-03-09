
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
  const [isProcessing, setIsProcessing] = useState(false); // Add a local processing state

  const handleConfirm = async () => {
    if (isProcessing || isLoading) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    try {
      if (action === 'delete') {
        await onConfirm();
      } else if (action === 'archive' && onArchive) {
        await onArchive();
      }
      setShowConfirm(false);
    } finally {
      // We don't reset isProcessing here because the component will likely unmount
      // after a successful operation
    }
  };

  const handleDelete = () => {
    if (isProcessing || isLoading) return; // Prevent multiple clicks
    setAction('delete');
    setShowConfirm(true);
  };

  const handleArchive = () => {
    if (isProcessing || isLoading) return; // Prevent multiple clicks
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
              disabled={isLoading || isProcessing}
              size="sm"
            >
              {action === 'delete' ? (
                <>
                  <Trash className="h-4 w-4 mr-1" />
                  {isProcessing ? "Processing..." : confirmText}
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-1" />
                  {isProcessing ? "Processing..." : "Confirm Archive"}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowConfirm(false)}
              disabled={isLoading || isProcessing}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isLoading || isProcessing}
          >
            <Trash className="h-4 w-4 mr-1" />
            {buttonText}
          </Button>
          
          {showArchive && onArchive && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-muted-foreground hover:text-muted-foreground"
              onClick={handleArchive}
              disabled={isLoading || isProcessing}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
