
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/lib/api/journalAPI";
import { CreateJournalEntryData, JournalEntry } from "@/lib/journalTypes";
import { toast } from "@/components/ui/use-toast";

export function useJournalEntries() {
  const queryClient = useQueryClient();
  
  // Fetch all journal entries
  const { 
    data: entries = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: fetchJournalEntries,
  });
  
  // Mutation for creating a journal entry
  const createMutation = useMutation({
    mutationFn: (data: CreateJournalEntryData) => createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast({
        title: "Journal entry created",
        description: "Your journal entry has been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save journal entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for updating a journal entry
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJournalEntryData> }) => 
      updateJournalEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast({
        title: "Journal entry updated",
        description: "Your journal entry has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update journal entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for deleting a journal entry
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast({
        title: "Journal entry deleted",
        description: "Your journal entry has been deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete journal entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Extract unique tags from entries
  const uniqueTags = [...new Set(entries
    .map(entry => entry.tag)
    .filter(tag => tag !== null) as string[]
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
