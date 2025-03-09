
export interface JournalEntry {
  id: string;
  content: string;
  tag: string | null;
  created_at: string;
  updated_at: string;
  sentiment_score: number | null;
}

export interface CreateJournalEntryData {
  content: string;
  tag: string | null;
}
