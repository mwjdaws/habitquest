
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type DeleteConfirmationProps = {
  onConfirm: () => void;
  isLoading: boolean;
};

export function DeleteConfirmation({ onConfirm, isLoading }: DeleteConfirmationProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      {showConfirm ? (
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this habit? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              <Trash className="mr-2 h-4 w-4" />
              Confirm Delete
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
        <Button 
          type="button" 
          variant="outline" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setShowConfirm(true)}
          disabled={isLoading}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Habit
        </Button>
      )}
    </div>
  );
}
