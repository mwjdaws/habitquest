
import { SleepFormData } from "@/lib/sleepTypes";
import { useSleepEntriesQuery } from "./useSleepQuery";
import { useSleepMutations } from "./useSleepMutations";

/**
 * Main hook for sleep entries management
 * Combines query and mutation hooks
 */
export function useSleepEntries() {
  const { data: sleepEntries = [], isLoading, error } = useSleepEntriesQuery();
  const { 
    createEntry, 
    updateEntry, 
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting
  } = useSleepMutations();

  return {
    sleepEntries,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Re-export the single entry query hook
export { useSleepEntryQuery } from "./useSleepQuery";
