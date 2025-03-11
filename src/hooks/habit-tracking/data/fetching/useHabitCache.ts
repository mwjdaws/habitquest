
import { useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to manage caching of habit data with cache invalidation
 */
export function useHabitCache() {
  const { user } = useAuth();
  const cachedDataRef = useRef<any>(null);
  const cacheExpiryRef = useRef(0);
  
  // Clear cache on user change
  useEffect(() => {
    cachedDataRef.current = null;
    cacheExpiryRef.current = 0;
    console.log("Cache cleared due to user change");
  }, [user]);
  
  // Check if the cache is valid
  const isValidCache = useCallback((now: number) => {
    return cachedDataRef.current && now < cacheExpiryRef.current;
  }, []);
  
  // Get cached data
  const getCachedData = useCallback(() => {
    const now = Date.now();
    if (isValidCache(now)) {
      const cacheAge = Math.round((now - (cacheExpiryRef.current - 30000))/1000);
      console.log("Using cached habit data, age:", cacheAge, "seconds");
      return cachedDataRef.current;
    }
    return null;
  }, [isValidCache]);
  
  // Update cache with new data
  const updateCache = useCallback((data: any, ttl: number = 30000) => {
    const now = Date.now();
    cachedDataRef.current = data;
    cacheExpiryRef.current = now + ttl;
    console.log(`Updated cache with new data (expires in ${ttl/1000}s)`);
  }, []);
  
  // Clear cache explicitly
  const clearCache = useCallback(() => {
    cachedDataRef.current = null;
    cacheExpiryRef.current = 0;
    console.log("Cache explicitly cleared");
  }, []);
  
  return {
    isValidCache,
    getCachedData,
    updateCache,
    clearCache
  };
}
