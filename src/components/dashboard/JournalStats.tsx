
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntryCount } from "./JournalEntryCount";
import { AverageSentiment } from "./AverageSentiment";
import { JournalingTrend } from "./JournalingTrend";
import { SentimentDistribution } from "./SentimentDistribution";

export function JournalStats() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Journal Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <JournalEntryCount />
            <AverageSentiment />
            <JournalingTrend />
          </div>
          <SentimentDistribution />
        </div>
      </CardContent>
    </Card>
  );
}
