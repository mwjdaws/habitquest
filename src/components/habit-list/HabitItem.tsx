
import { useState } from "react";
import { HabitForm } from "@/components/HabitForm";
import { Habit } from "@/lib/habitTypes";
import { HabitItemContent } from "./habit-item/HabitItemContent";
import { HabitItemActions } from "./habit-item/HabitItemActions";
import { DeleteDialog } from "./habit-item/DeleteDialog";
import { ArchiveDialog } from "./habit-item/ArchiveDialog";
import { Card, CardContent } from "@/components/ui/card";

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
            <HabitItemContent habit={habit} />
            <HabitItemActions 
              habit={habit}
              isCompleted={isCompleted}
              onToggle={onToggle}
              onEdit={() => setShowEditForm(true)}
              onShowArchive={() => setShowArchiveDialog(true)}
              onShowDelete={() => setShowDeleteDialog(true)}
            />
          </CardContent>
        )}
      </Card>

      <DeleteDialog 
        habit={habit}
        isOpen={showDeleteDialog}
        setIsOpen={setShowDeleteDialog}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onDelete={onDelete || onUpdate}
      />

      <ArchiveDialog 
        habit={habit}
        isOpen={showArchiveDialog}
        setIsOpen={setShowArchiveDialog}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onArchive={onDelete || onUpdate}
      />
    </>
  );
}
