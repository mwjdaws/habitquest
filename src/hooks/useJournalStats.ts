
import { useMemo } from "react";
import { useJournalEntries } from "./useJournalEntries";
import { formatInTorontoTimezone } from "@/lib/dateUtils";

type DailyJournalCount = {
  date: string;
  count: number;
  averageSentiment: number | null;
};

type SentimentCategory = {
  category: string;
  count: number;
  color: string;
};

export function useJournalStats() {
  const { entries, isLoading, error } = useJournalEntries();
  
  // Calculate journal statistics
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalEntries: 0,
        averageSentiment: null,
        dailyJournalCounts: [],
        sentimentDistribution: []
      };
    }

    // Calculate total entries
    const totalEntries = entries.length;
    
    // Calculate average sentiment
    const sentimentValues = entries
      .filter(entry => entry.sentiment_score !== null)
      .map(entry => entry.sentiment_score as number);
    
    const averageSentiment = sentimentValues.length > 0
      ? sentimentValues.reduce((sum, score) => sum + score, 0) / sentimentValues.length
      : null;
    
    // Group entries by date for the heatmap
    const entriesByDate = entries.reduce<Record<string, { count: number, sentimentSum: number, sentimentCount: number }>>(
      (acc, entry) => {
        const date = formatInTorontoTimezone(new Date(entry.created_at), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = { count: 0, sentimentSum: 0, sentimentCount: 0 };
        }
        acc[date].count += 1;
        
        if (entry.sentiment_score !== null) {
          acc[date].sentimentSum += entry.sentiment_score;
          acc[date].sentimentCount += 1;
        }
        
        return acc;
      },
      {}
    );
    
    // Convert to array format for the chart
    const dailyJournalCounts: DailyJournalCount[] = Object.entries(entriesByDate).map(
      ([date, data]) => ({
        date,
        count: data.count,
        averageSentiment: data.sentimentCount > 0 ? data.sentimentSum / data.sentimentCount : null,
      })
    ).sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate sentiment distribution
    const sentimentCategories: Record<string, number> = {
      "Very Positive": 0,
      "Positive": 0,
      "Neutral": 0,
      "Negative": 0,
      "Very Negative": 0,
    };
    
    entries.forEach(entry => {
      if (entry.sentiment_score === null) return;
      
      const score = entry.sentiment_score;
      
      if (score > 0.6) sentimentCategories["Very Positive"]++;
      else if (score > 0.2) sentimentCategories["Positive"]++;
      else if (score > -0.2) sentimentCategories["Neutral"]++;
      else if (score > -0.6) sentimentCategories["Negative"]++;
      else sentimentCategories["Very Negative"]++;
    });
    
    const sentimentColors = {
      "Very Positive": "#22c55e", // green-500
      "Positive": "#86efac", // green-300
      "Neutral": "#d1d5db", // gray-300
      "Negative": "#fca5a5", // red-300
      "Very Negative": "#ef4444", // red-500
    };
    
    const sentimentDistribution: SentimentCategory[] = Object.entries(sentimentCategories)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        category,
        count,
        color: sentimentColors[category as keyof typeof sentimentColors],
      }));
    
    return {
      totalEntries,
      averageSentiment,
      dailyJournalCounts,
      sentimentDistribution,
    };
  }, [entries]);
  
  return {
    ...stats,
    isLoading,
    error,
  };
}
