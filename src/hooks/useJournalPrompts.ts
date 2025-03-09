
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    async function fetchPrompts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('journal_prompts')
          .select('*');
        
        if (error) {
          throw new Error(error.message);
        }
        
        setPrompts(data || []);
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchPrompts();
  }, []);
  
  return { prompts, loading, error };
}
