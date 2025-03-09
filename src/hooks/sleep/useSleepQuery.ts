
import { useQuery } from "@tanstack/react-query";
import { fetchSleepEntries, fetchSleepEntry } from "@/lib/api/sleepAPI";

/**
 * Hook to fetch all sleep entries
 */
export function useSleepEntriesQuery() {
  return useQuery({
    queryKey: ["sleepEntries"],
    queryFn: fetchSleepEntries,
  });
}

/**
 * Hook to fetch a single sleep entry by id
 */
export function useSleepEntryQuery(id: string) {
  return useQuery({
    queryKey: ["sleepEntry", id],
    queryFn: () => fetchSleepEntry(id),
    enabled: !!id,
  });
}
