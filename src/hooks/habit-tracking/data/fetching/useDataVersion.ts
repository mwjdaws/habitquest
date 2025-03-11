
import { useRef, useCallback } from "react";

/**
 * Hook to manage data versioning for tracking request order
 */
export function useDataVersion() {
  const dataVersionRef = useRef(0);
  
  // Get current version
  const getCurrentVersion = useCallback(() => {
    return dataVersionRef.current;
  }, []);
  
  // Increment and get next version
  const getNextVersion = useCallback(() => {
    return ++dataVersionRef.current;
  }, []);
  
  return {
    getCurrentVersion,
    getNextVersion
  };
}
