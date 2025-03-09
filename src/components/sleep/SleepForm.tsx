
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateTimeSleptMinutes } from "@/lib/api/sleepAPI";
import { getTodayFormattedInToronto } from "@/lib/dateUtils";
import { SleepEntry, SleepFormData } from "@/lib/sleepTypes";

const sleepFormSchema = z.object({
  sleep_date: z.string().nonempty("Date is required"),
  bedtime: z.string().nonempty("Bedtime is required"),
  wake_time: z.string().nonempty("Wake time is required"),
  quality_score: z.number().min(0).max(100),
  routine_score: z.number().min(0).max(100),
  heart_rate: z.number().optional(),
  hrv: z.number().optional(),
  breath_rate: z.number().optional(),
  snoring_percentage: z.number().min(0).max(100).optional(),
  sleep_latency_minutes: z.number().optional(),
});

interface SleepFormProps {
  initialData?: SleepEntry;
  onSubmit: (data: SleepFormData) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function SleepForm({ initialData, onSubmit, isSubmitting, onCancel }: SleepFormProps) {
  const [calculatedSleepTime, setCalculatedSleepTime] = useState<number | null>(
    initialData ? initialData.time_slept_minutes : null
  );

  const form = useForm<SleepFormData>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: initialData ? {
      sleep_date: initialData.sleep_date,
      bedtime: initialData.bedtime,
      wake_time: initialData.wake_time,
      quality_score: initialData.quality_score,
      routine_score: initialData.routine_score,
      heart_rate: initialData.heart_rate,
      hrv: initialData.hrv,
      breath_rate: initialData.breath_rate,
      snoring_percentage: initialData.snoring_percentage,
      sleep_latency_minutes: initialData.sleep_latency_minutes,
    } : {
      sleep_date: getTodayFormattedInToronto(),
      bedtime: "22:00",
      wake_time: "06:30",
      quality_score: 75,
      routine_score: 75,
      heart_rate: undefined,
      hrv: undefined,
      breath_rate: undefined,
      snoring_percentage: undefined,
      sleep_latency_minutes: undefined,
    },
  });

  const { watch } = form;

  // Recalculate time slept when bedtime or wake time changes
  const bedtime = watch("bedtime");
  const wakeTime = watch("wake_time");

  // Update calculated sleep time whenever bedtime or wake time changes
  React.useEffect(() => {
    if (bedtime && wakeTime) {
      const minutes = calculateTimeSleptMinutes(bedtime, wakeTime);
      setCalculatedSleepTime(minutes);
    }
  }, [bedtime, wakeTime]);

  // Format minutes as hours and minutes
  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSubmit = (data: SleepFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Sleep Entry" : "Add Sleep Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sleep_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-center">
                {calculatedSleepTime !== null && (
                  <div className="text-center">
                    <div className="text-lg font-medium">Sleep Duration</div>
                    <div className="text-2xl font-bold text-habit-purple">
                      {formatSleepTime(calculatedSleepTime)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bedtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedtime</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wake_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wake Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quality_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Quality ({field.value}%)</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      How well did you sleep?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="routine_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routine Consistency ({field.value}%)</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      How consistent was your sleep routine?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="heart_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Optional" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hrv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate Variability (ms)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Optional" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="breath_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breath Rate (breaths/min)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Optional" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="snoring_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snoring (% of sleep time)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Optional" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sleep_latency_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time to Fall Asleep (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Optional" 
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button variant="outline" type="button" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
