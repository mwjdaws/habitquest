
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleOff, Clock, Heart, Loader, Pulse, Zap } from "lucide-react";
import { SleepEntry } from "@/lib/sleepTypes";

interface SleepStatsProps {
  sleepEntries: SleepEntry[];
  isLoading: boolean;
}

export const SleepStats: React.FC<SleepStatsProps> = ({ sleepEntries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Loader className="h-4 w-4 animate-spin" />
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!sleepEntries.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <CircleOff className="h-4 w-4" />
                No Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate average time slept in hours and minutes
  const avgTimeSlept = sleepEntries.reduce((sum, entry) => sum + entry.time_slept_minutes, 0) / sleepEntries.length;
  const avgHours = Math.floor(avgTimeSlept / 60);
  const avgMinutes = Math.round(avgTimeSlept % 60);
  
  // Calculate average quality score
  const avgQualityScore = sleepEntries.reduce((sum, entry) => sum + entry.quality_score, 0) / sleepEntries.length;
  
  // Calculate average routine score
  const avgRoutineScore = sleepEntries.reduce((sum, entry) => sum + entry.routine_score, 0) / sleepEntries.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Avg. Sleep Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgHours}h {avgMinutes}m</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Pulse className="h-4 w-4" />
            Avg. Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgQualityScore.toFixed(1)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            Avg. Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRoutineScore.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
