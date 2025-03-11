
import { useCallback } from 'react';
import { createDefaultHabits } from '@/lib/api/habit';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for initializing default habits for new users
 */
export function useHabitInit() {
  /**
   * Initializes default habits for a user
   */
  const initializeHabits = useCallback(async () => {
    console.log("[useHabitInit] Initializing default habits");
    
    try {
      await createDefaultHabits();
      
      toast({
        title: "Welcome to Habit Tracker!",
        description: "We've created some starter habits for you.",
      });
    } catch (error) {
      console.error("Failed to initialize habits:", error);
      
      toast({
        title: "Initialization Error",
        description: "Failed to create starter habits. Please try again later.",
        variant: "destructive",
      });
    }
  }, []);

  return { initializeHabits };
}
