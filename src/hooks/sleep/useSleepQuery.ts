
import { useQuery } from "@tanstack/react-query";
import { fetchSleepEntries, fetchSleepEntry } from "@/lib/api/sleepAPI";

/**
 * Hook to fetch all sleep entries with optimized caching
 */
export function useSleepEntriesQuery() {
  return useQuery({
    queryKey: ["sleepEntries"],
    queryFn: fetchSleepEntries,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });
}

/**
 * Hook to fetch a single sleep entry by id with optimized caching
 */
export function useSleepEntryQuery(id: string) {
  return useQuery({
    queryKey: ["sleepEntry", id],
    queryFn: () => fetchSleepEntry(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });
}
