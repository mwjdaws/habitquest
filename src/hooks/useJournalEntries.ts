
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchJournalEntries, 
  createJournalEntry, 
  updateJournalEntry, 
  deleteJournalEntry 
} from "@/lib/api/journalAPI";
import { CreateJournalEntryData, JournalEntry } from "@/lib/journalTypes";
import { toast } from "@/components/ui/use-toast";

// Constants for query keys
const JOURNAL_ENTRIES_QUERY_KEY = ['journalEntries'];

export function useJournalEntries() {
  const queryClient = useQueryClient();
  
  // Helper function to invalidate journal entries cache
  const invalidateJournalEntries = () => {
    queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_QUERY_KEY });
  };
  
  // Common toast error handler
  const handleError = (operation: string, error: Error) => {
    toast({
      title: "Error",
      description: `Failed to ${operation}: ${error.message}`,
      variant: "destructive",
    });
  };
  
  // Common toast success handler
  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };
  
  // Fetch all journal entries
  const { 
    data: entries = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: JOURNAL_ENTRIES_QUERY_KEY,
    queryFn: fetchJournalEntries,
  });
  
  // Mutation for creating a journal entry
  const createMutation = useMutation({
    mutationFn: (data: CreateJournalEntryData) => createJournalEntry(data),
    onSuccess: () => {
      invalidateJournalEntries();
      handleSuccess("Your journal entry has been saved");
    },
    onError: (error) => {
      handleError("save journal entry", error);
    },
  });
  
  // Mutation for updating a journal entry
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJournalEntryData> }) => 
      updateJournalEntry(id, data),
    onSuccess: () => {
      invalidateJournalEntries();
      handleSuccess("Your journal entry has been updated");
    },
    onError: (error) => {
      handleError("update journal entry", error);
    },
  });
  
  // Mutation for deleting a journal entry
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      invalidateJournalEntries();
      handleSuccess("Your journal entry has been deleted");
    },
    onError: (error) => {
      handleError("delete journal entry", error);
    },
  });
  
  // Extract unique tags from entries
  const uniqueTags = [...new Set(entries
    .filter(entry => entry.tag !== null)
    .map(entry => entry.tag as string)
  )].sort();
  
  return {
    entries,
    isLoading,
    error,
    uniqueTags,
    refetch,
    createJournalEntry: (data: CreateJournalEntryData) => createMutation.mutate(data),
    updateJournalEntry: (id: string, data: Partial<CreateJournalEntryData>) => 
      updateMutation.mutate({ id, data }),
    deleteJournalEntry: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
