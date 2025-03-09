
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Tag, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { JournalEntry } from '@/lib/journalTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatInTorontoTimezone, toTorontoTime } from '@/lib/dateUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface JournalEntryListProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function JournalEntryList({ entries, onDelete, isDeleting }: JournalEntryListProps) {
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  
  // Group entries by date in Toronto timezone
  const groupedEntries = entries.reduce<Record<string, JournalEntry[]>>((groups, entry) => {
    const date = formatInTorontoTimezone(new Date(entry.created_at), 'yyyy-MM-dd');
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
  
  const getSentimentIcon = (score: number | null) => {
    if (score === null) return null;
    
    if (score > 0.2) return <ThumbsUp className="h-4 w-4 text-green-500" />;
    if (score < -0.2) return <ThumbsDown className="h-4 w-4 text-red-500" />;
    return null;
  };
  
  const getSentimentLabel = (score: number | null) => {
    if (score === null) return "No sentiment data";
    
    if (score > 0.6) return "Very positive";
    if (score > 0.2) return "Positive";
    if (score > -0.2) return "Neutral";
    if (score > -0.6) return "Negative";
    return "Very negative";
  };
  
  const getSentimentColor = (score: number | null) => {
    if (score === null) return "bg-gray-100";
    
    if (score > 0.6) return "bg-green-100 text-green-800";
    if (score > 0.2) return "bg-green-50 text-green-600";
    if (score > -0.2) return "bg-gray-100 text-gray-800";
    if (score > -0.6) return "bg-red-50 text-red-600";
    return "bg-red-100 text-red-800";
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
            {formatInTorontoTimezone(new Date(date), 'EEEE, MMMM d, yyyy')}
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
                      {formatInTorontoTimezone(new Date(entry.created_at), 'h:mm a')}
                    </CardTitle>
                    {entry.tag && (
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {entry.tag}
                      </Badge>
                    )}
                    
                    {entry.sentiment_score !== null && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="secondary"
                              className={`gap-1 ${getSentimentColor(entry.sentiment_score)}`}
                            >
                              {getSentimentIcon(entry.sentiment_score)}
                              {getSentimentLabel(entry.sentiment_score)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sentiment score: {entry.sentiment_score.toFixed(2)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
