
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createSleepEntry, 
  updateSleepEntry, 
  deleteSleepEntry 
} from "@/lib/api/sleepAPI";
import { SleepFormData } from "@/lib/sleepTypes";
import { toast } from "sonner";

/**
 * Hook providing mutations for sleep entries
 */
export function useSleepMutations() {
  const queryClient = useQueryClient();

  const createEntryMutation = useMutation({
    mutationFn: createSleepEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleepEntries"] });
      toast.success("Sleep entry created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sleep entry: ${error.message}`);
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SleepFormData }) => 
      updateSleepEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleepEntries"] });
      toast.success("Sleep entry updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update sleep entry: ${error.message}`);
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: deleteSleepEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleepEntries"] });
      toast.success("Sleep entry deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sleep entry: ${error.message}`);
    },
  });

  return {
    createEntry: (data: SleepFormData) => createEntryMutation.mutate(data),
    updateEntry: (id: string, data: SleepFormData) => 
      updateEntryMutation.mutate({ id, data }),
    deleteEntry: (id: string) => deleteEntryMutation.mutate(id),
    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
}
