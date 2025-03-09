
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import { JournalEntryList } from "@/components/journal/JournalEntryList";
import { JournalFilters } from "@/components/journal/JournalFilters";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { CreateJournalEntryData, JournalEntry } from "@/lib/journalTypes";

const Journal = () => {
  const { 
    entries, 
    uniqueTags, 
    isLoading, 
    error, 
    createJournalEntry, 
    deleteJournalEntry,
    isCreating,
    isDeleting
  } = useJournalEntries();
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const handleSaveEntry = (data: CreateJournalEntryData) => {
    createJournalEntry(data);
  };
  
  const handleDeleteEntry = (id: string) => {
    deleteJournalEntry(id);
  };
  
  // Filter entries by selected tag
  const filteredEntries = selectedTag
    ? entries.filter(entry => entry.tag === selectedTag)
    : entries;
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
          <CardDescription>Record your thoughts and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalEntryForm 
            onSave={handleSaveEntry} 
            availableTags={uniqueTags}
            isSaving={isCreating}
          />
          
          <div className="space-y-4">
            <JournalFilters 
              tags={uniqueTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
            
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading journal entries...
              </div>
            ) : (
              <JournalEntryList 
                entries={filteredEntries} 
                onDelete={handleDeleteEntry}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;
