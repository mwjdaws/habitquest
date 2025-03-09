
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJournalStats } from "@/hooks/useJournalStats";
import { Heart } from "lucide-react";

export function AverageSentiment() {
  const { averageSentiment, isLoading } = useJournalStats();
  
  // Format sentiment score
  const formattedSentiment = averageSentiment !== null 
    ? averageSentiment.toFixed(2) 
    : 'N/A';
    
  // Get sentiment text and color
  const getSentimentInfo = (score: number | null) => {
    if (score === null) return { text: 'No data', color: 'text-gray-500' };
    
    if (score > 0.6) return { text: 'Very Positive', color: 'text-green-500' };
    if (score > 0.2) return { text: 'Positive', color: 'text-green-400' };
    if (score > -0.2) return { text: 'Neutral', color: 'text-gray-500' };
    if (score > -0.6) return { text: 'Negative', color: 'text-red-400' };
    return { text: 'Very Negative', color: 'text-red-500' };
  };
  
  const sentimentInfo = getSentimentInfo(averageSentiment);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
        <Heart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-7 bg-muted rounded-md" />
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedSentiment}</div>
            <p className={`text-xs ${sentimentInfo.color} mt-1`}>
              {sentimentInfo.text}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
