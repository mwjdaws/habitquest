
import { useState } from "react";
import { SleepForm } from "@/components/sleep/SleepForm";
import { SleepEntryList } from "@/components/sleep/SleepEntryList";
import { SleepStats } from "@/components/sleep/SleepStats";
import { useSleepEntries } from "@/hooks/useSleepEntries";
import { SleepEntry, SleepFormData } from "@/lib/sleepTypes";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Sleep() {
  const {
    sleepEntries,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSleepEntries();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<SleepEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEntryToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: SleepEntry) => {
    setEntryToEdit(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEntryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteEntry(entryToDelete);
      setIsDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleFormSubmit = (data: SleepFormData) => {
    if (entryToEdit) {
      updateEntry(entryToEdit.id, data);
    } else {
      createEntry(data);
    }
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Sleep Tracker</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-habit-purple"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Sleep Tracker</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>Error loading sleep data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Sleep Tracker</h1>
      
      <SleepStats sleepEntries={sleepEntries} isLoading={false} />
      
      <SleepEntryList
        entries={sleepEntries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />
      
      {/* Entry Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{entryToEdit ? "Edit Sleep Entry" : "Add Sleep Entry"}</DialogTitle>
            <DialogDescription>
              Track your sleep patterns to improve your rest quality.
            </DialogDescription>
          </DialogHeader>
          <SleepForm
            defaultValues={entryToEdit || undefined}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
            title={entryToEdit ? "Edit Sleep Entry" : "Add Sleep Entry"}
            submitLabel={entryToEdit ? "Update Entry" : "Save Entry"}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sleep Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sleep entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
