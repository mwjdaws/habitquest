
import { SleepEntry } from "@/lib/sleepTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatInTorontoTimezone } from "@/lib/dateUtils";
import { Edit, Trash2, Moon, Sunrise, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SleepEntryCardProps {
  entry: SleepEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export function SleepEntryCard({ entry, onEdit, onDelete }: SleepEntryCardProps) {
  // Format sleep date
  const formattedDate = formatInTorontoTimezone(new Date(entry.sleep_date), 'EEEE, MMMM d, yyyy');
  
  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get sleep quality description
  const getSleepQuality = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 75) return { label: "Good", color: "bg-emerald-100 text-emerald-800" };
    if (score >= 60) return { label: "Fair", color: "bg-amber-100 text-amber-800" };
    if (score >= 40) return { label: "Poor", color: "bg-orange-100 text-orange-800" };
    return { label: "Very Poor", color: "bg-red-100 text-red-800" };
  };

  const quality = getSleepQuality(entry.quality_score);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b px-4 py-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{formattedDate}</h3>
            <Badge variant="outline" className={quality.color}>{quality.label} Sleep</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-habit-purple" />
            <div>
              <div className="text-sm text-muted-foreground">Bedtime</div>
              <div className="font-medium">{entry.bedtime}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sunrise className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-sm text-muted-foreground">Wake Time</div>
              <div className="font-medium">{entry.wake_time}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{formatDuration(entry.time_slept_minutes)}</div>
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Sleep Quality</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-habit-purple" 
                style={{ width: `${entry.quality_score}%` }}
              ></div>
            </div>
            <div className="text-sm text-right">{entry.quality_score}%</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Routine Consistency</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500" 
                style={{ width: `${entry.routine_score}%` }}
              ></div>
            </div>
            <div className="text-sm text-right">{entry.routine_score}%</div>
          </div>
        </div>
        
        {(entry.heart_rate || entry.hrv || entry.breath_rate || entry.snoring_percentage || entry.sleep_latency_minutes) && (
          <div className="px-4 pb-4 border-t pt-3">
            <div className="text-sm font-medium mb-2">Additional Metrics</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {entry.heart_rate && (
                <div>
                  <div className="text-muted-foreground">Heart Rate</div>
                  <div>{entry.heart_rate} bpm</div>
                </div>
              )}
              
              {entry.hrv && (
                <div>
                  <div className="text-muted-foreground">HRV</div>
                  <div>{entry.hrv} ms</div>
                </div>
              )}
              
              {entry.breath_rate && (
                <div>
                  <div className="text-muted-foreground">Breathing</div>
                  <div>{entry.breath_rate}/min</div>
                </div>
              )}
              
              {entry.snoring_percentage !== null && entry.snoring_percentage !== undefined && (
                <div>
                  <div className="text-muted-foreground">Snoring</div>
                  <div>{entry.snoring_percentage}%</div>
                </div>
              )}
              
              {entry.sleep_latency_minutes && (
                <div>
                  <div className="text-muted-foreground">Time to Sleep</div>
                  <div>{entry.sleep_latency_minutes} min</div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
