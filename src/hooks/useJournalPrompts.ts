
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";
import { handleError } from '@/lib/error-utils';

export interface JournalPrompt {
  id: string;
  text: string;
  tag: string;
}

export function useJournalPrompts() {
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchPrompts() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('journal_prompts')
          .select('*')
          .abortSignal(controller.signal);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Validate data shape
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        
        setPrompts(data || []);
      } catch (err) {
        // Don't set error state if request was aborted
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        
        const errorMessage = handleError(
          err, 
          'fetching journal prompts', 
          'Unable to load journal prompts', 
          false
        );
        console.error('Failed to fetch prompts:', errorMessage);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchPrompts();
    
    // Cleanup function to abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, []);
  
  const refetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('journal_prompts')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setPrompts(data || []);
    } catch (err) {
      const errorMessage = handleError(
        err, 
        'refetching journal prompts', 
        'Unable to refresh journal prompts', 
        true
      );
      console.error('Failed to refetch prompts:', errorMessage);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };
  
  return { prompts, loading, error, refetchPrompts };
}
