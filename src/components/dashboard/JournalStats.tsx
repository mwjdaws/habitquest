
import { JournalEntryCount } from "./JournalEntryCount";
import { AverageSentiment } from "./AverageSentiment";
import { JournalingTrend } from "./JournalingTrend";
import { SentimentDistribution } from "./SentimentDistribution";

export function JournalStats() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <JournalEntryCount />
        <AverageSentiment />
        <JournalingTrend />
      </div>
      <SentimentDistribution />
    </div>
  );
}
