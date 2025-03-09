
import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { JournalEntry } from '@/lib/journalTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function JournalEntryList({ entries, onDelete, isDeleting }: JournalEntryListProps) {
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  
  // Group entries by date
  const groupedEntries = entries.reduce<Record<string, JournalEntry[]>>((groups, entry) => {
    const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});
  
  const toggleEntry = (id: string) => {
    setExpandedEntries({
      ...expandedEntries,
      [id]: !expandedEntries[id]
    });
  };
  
  if (entries.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No journal entries yet. Start writing to see your entries here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([date, entriesForDate]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {entriesForDate.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <Collapsible
                open={expandedEntries[entry.id]}
                onOpenChange={() => toggleEntry(entry.id)}
                className="w-full"
              >
                <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        {expandedEntries[entry.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CardTitle className="text-base">
                      {format(new Date(entry.created_at), 'h:mm a')}
                    </CardTitle>
                    {entry.tag && (
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {entry.tag}
                      </Badge>
                    )}
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 opacity-60 hover:opacity-100 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your journal entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(entry.id)}
                          disabled={isDeleting}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                
                {/* Preview of content when collapsed */}
                {!expandedEntries[entry.id] && (
                  <CardContent className="pt-0 pb-4 px-4">
                    <p className="text-sm line-clamp-1 text-muted-foreground">
                      {entry.content}
                    </p>
                  </CardContent>
                )}
                
                {/* Full content when expanded */}
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4 px-4">
                    <p className="whitespace-pre-wrap text-sm">
                      {entry.content}
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
