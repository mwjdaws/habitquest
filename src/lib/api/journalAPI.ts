
import { supabase } from "../supabase";
import { CreateJournalEntryData, JournalEntry } from "../journalTypes";
import { getAuthenticatedUser, handleApiError } from "./apiUtils";

/**
 * Fetches all journal entries for the current user
 */
export const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as JournalEntry[];
  } catch (error) {
    return handleApiError(error, 'fetching journal entries', []);
  }
};

/**
 * Analyzes sentiment of journal content using edge function
 */
async function analyzeSentiment(content: string): Promise<number> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
      body: { content }
    });
    
    if (error) {
      console.error('Error analyzing sentiment:', error);
      return 0; // Default to neutral on error
    }
    
    return data.sentimentScore;
  } catch (error) {
    console.error('Exception analyzing sentiment:', error);
    return 0; // Default to neutral on exception
  }
}

/**
 * Creates a new journal entry
 */
export const createJournalEntry = async (data: CreateJournalEntryData): Promise<JournalEntry> => {
  try {
    const userId = await getAuthenticatedUser();
    
    // Analyze sentiment
    const sentimentScore = await analyzeSentiment(data.content);
    
    const { data: newEntry, error } = await supabase
      .from('journal_entries')
      .insert([{
        ...data,
        user_id: userId,
        sentiment_score: sentimentScore
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return newEntry as JournalEntry;
  } catch (error) {
    throw handleApiError(error, 'creating journal entry');
  }
};

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (id: string, data: Partial<CreateJournalEntryData>): Promise<JournalEntry> => {
  try {
    // If content is being updated, re-analyze sentiment
    let updateData: any = { ...data };
    
    if (data.content) {
      const sentimentScore = await analyzeSentiment(data.content);
      updateData.sentiment_score = sentimentScore;
    }
    
    const { data: updatedEntry, error } = await supabase
      .from('journal_entries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return updatedEntry as JournalEntry;
  } catch (error) {
    throw handleApiError(error, 'updating journal entry');
  }
};

/**
 * Deletes a journal entry
 */
export const deleteJournalEntry = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    throw handleApiError(error, 'deleting journal entry');
  }
};
