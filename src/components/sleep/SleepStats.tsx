
import { SleepEntry } from "@/lib/sleepTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BadgeClock, 
  Clock, 
  Moon, 
  Sunrise, 
  TrendingUp, 
  BarChart 
} from "lucide-react";

interface SleepStatsProps {
  entries: SleepEntry[];
}

export function SleepStats({ entries }: SleepStatsProps) {
  if (entries.length === 0) {
    return null;
  }

  // Calculate average sleep duration
  const avgSleepDuration = entries.reduce((sum, entry) => sum + entry.time_slept_minutes, 0) / entries.length;
  
  // Format hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };
  
  // Calculate average bedtime and wake time
  const calculateAverageTime = (timeArray: string[]) => {
    // Convert times to minutes since midnight
    const minutesArray = timeArray.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    // Calculate average minutes
    const avgMinutes = minutesArray.reduce((sum, mins) => sum + mins, 0) / minutesArray.length;
    
    // Convert back to hours:minutes
    const hours = Math.floor(avgMinutes / 60) % 24;
    const minutes = Math.floor(avgMinutes % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  const avgBedtime = calculateAverageTime(entries.map(entry => entry.bedtime));
  const avgWakeTime = calculateAverageTime(entries.map(entry => entry.wake_time));
  
  // Calculate average quality score
  const avgQualityScore = entries.reduce((sum, entry) => sum + entry.quality_score, 0) / entries.length;
  
  // Calculate consistency score
  const avgConsistencyScore = entries.reduce((sum, entry) => sum + entry.routine_score, 0) / entries.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sleep Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20">
            <BadgeClock className="h-10 w-10 text-habit-purple" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Sleep Duration</p>
              <h4 className="text-2xl font-bold">{formatDuration(avgSleepDuration)}</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <Moon className="h-10 w-10 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Bedtime</p>
              <h4 className="text-2xl font-bold">{avgBedtime}</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <Sunrise className="h-10 w-10 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Wake Time</p>
              <h4 className="text-2xl font-bold">{avgWakeTime}</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
            <TrendingUp className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
              <h4 className="text-2xl font-bold">{Math.round(avgQualityScore)}%</h4>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
