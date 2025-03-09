
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText } from "lucide-react";
import { useJournalStats } from "@/hooks/useJournalStats";

export function JournalEntryCount() {
  const { totalEntries, isLoading } = useJournalStats();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
        <BookText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-7 bg-muted rounded-md" />
        ) : (
          <div className="text-2xl font-bold">{totalEntries}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Total journal entries
        </p>
      </CardContent>
    </Card>
  );
}
