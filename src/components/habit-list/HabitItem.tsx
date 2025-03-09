
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Tag, Zap, Trash, Archive, Edit } from "lucide-react";
import { HabitForm } from "@/components/HabitForm";
import { Habit } from "@/lib/habitTypes";
import { deleteHabit, archiveHabit } from "@/lib/api/habitCrudAPI";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

type HabitItemProps = {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onUpdate: () => void;
  onDelete?: () => void;
};

export function HabitItem({ 
  habit, 
  isCompleted, 
  onToggle, 
  onUpdate,
  onDelete
}: HabitItemProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleHabitSaved = () => {
    onUpdate();
    setShowEditForm(false);
  };
  
  const handleHabitDeleted = () => {
    if (onDelete) {
      onDelete();
    } else {
      onUpdate();
    }
    setShowEditForm(false);
  };

  const handleQuickDelete = async () => {
    setIsProcessing(true);
    try {
      console.log(`Starting deletion of habit ID: ${habit.id}`);
      await deleteHabit(habit.id);
      console.log(`Successfully deleted habit ID: ${habit.id}`);
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been permanently deleted",
      });
      
      setShowDeleteDialog(false);
      
      // Use a slight delay to ensure state is updated properly
      setTimeout(() => {
        if (onDelete) {
          console.log("Calling onDelete callback");
          onDelete();
        } else {
          console.log("Calling onUpdate callback");
          onUpdate();
        }
      }, 100);
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickArchive = async () => {
    setIsProcessing(true);
    try {
      console.log(`Starting archiving of habit ID: ${habit.id}`);
      await archiveHabit(habit.id);
      console.log(`Successfully archived habit ID: ${habit.id}`);
      
      toast({
        title: "Habit archived",
        description: "Your habit has been archived and can be restored later",
      });
      
      setShowArchiveDialog(false);
      
      // Use a slight delay to ensure state is updated properly
      setTimeout(() => {
        if (onDelete) {
          console.log("Calling onDelete callback after archive");
          onDelete();
        } else {
          console.log("Calling onUpdate callback after archive");
          onUpdate();
        }
      }, 100);
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
    <>
      <Card className={`border-l-4 border-l-${habit.color}`}>
        {showEditForm ? (
          <CardContent className="pt-6">
            <HabitForm 
              habit={habit} 
              onSave={handleHabitSaved} 
              onCancel={() => setShowEditForm(false)}
              onDelete={handleHabitDeleted}
            />
          </CardContent>
        ) : (
          <CardContent className="p-4 flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowEditForm(true)}
                className="h-8 w-8"
                title="Edit habit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowArchiveDialog(true)}
                className="h-8 w-8 text-muted-foreground"
                title="Archive habit"
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-destructive"
                title="Delete habit"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button 
                variant={isCompleted ? "default" : "outline"} 
                size="sm"
                className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
                onClick={() => onToggle(habit.id)}
              >
                {isCompleted && <Check className="mr-1 h-4 w-4" />}
                {isCompleted ? "Done" : "Mark Complete"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
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
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
