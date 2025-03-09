
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
 * Creates a new journal entry
 */
export const createJournalEntry = async (data: CreateJournalEntryData): Promise<JournalEntry> => {
  try {
    const userId = await getAuthenticatedUser();
    
    const { data: newEntry, error } = await supabase
      .from('journal_entries')
      .insert([{
        ...data,
        user_id: userId,
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
    const { data: updatedEntry, error } = await supabase
      .from('journal_entries')
      .update(data)
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
