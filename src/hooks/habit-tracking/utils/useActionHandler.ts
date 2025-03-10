
import { useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/lib/error-utils";

/**
 * Generic action handler with consistent error handling
 */
export function useActionHandler() {
  const handleAction = useCallback(async <T,>(
    actionName: string,
    actionKey: string,
    pendingActionsRef: React.MutableRefObject<Set<string>>,
    apiAction: () => Promise<T>,
    onSuccess: (result: T) => void,
    onError?: (error: any) => void,
    refreshData?: () => void,
    successToast?: { title: string, description: string }
  ) => {
    // Prevent duplicate requests
    if (pendingActionsRef.current.has(actionKey)) {
      console.log(`${actionName} action already in progress:`, actionKey);
      return;
    }
    
    try {
      pendingActionsRef.current.add(actionKey);
      
      // Send to server with timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      const result = await Promise.race([
        apiAction(),
        timeoutPromise
      ]) as T;
      
      onSuccess(result);
      
      // Show success toast if provided
      if (successToast) {
        toast({
          title: successToast.title,
          description: successToast.description,
        });
      }
      
      // Silent background refresh after a short delay
      if (refreshData) {
        setTimeout(() => {
          if (pendingActionsRef.current.has(actionKey)) {
            refreshData();
          }
        }, 300);
      }
      
      return result;
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      
      // Allow custom error handling
      if (onError) {
        onError(error);
      }
      
      // Refresh data to ensure UI is in sync
      if (refreshData) {
        refreshData();
      }
      
      handleApiError(
        error, 
        actionName, 
        `Failed to ${actionName.toLowerCase()}. Please try again.`, 
        true
      );
      
      return null;
    } finally {
      pendingActionsRef.current.delete(actionKey);
    }
  }, []);
  
  return { handleAction };
}
