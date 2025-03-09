
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SleepFormData } from "@/lib/sleepTypes";
import { getTodayFormattedInToronto } from "@/lib/dateUtils";

const formSchema = z.object({
  sleep_date: z.string().min(1, "Date is required"),
  bedtime: z.string().min(1, "Bedtime is required"),
  wake_time: z.string().min(1, "Wake time is required"),
  quality_score: z.number().min(0).max(100),
  routine_score: z.number().min(0).max(100),
  heart_rate: z.number().optional(),
  hrv: z.number().optional(),
  breath_rate: z.number().optional(),
  snoring_percentage: z.number().min(0).max(100).optional(),
  sleep_latency_minutes: z.number().optional(),
});

interface SleepFormProps {
  defaultValues?: Partial<SleepFormData>;
  onSubmit: (data: SleepFormData) => void;
  isSubmitting?: boolean;
  title?: string;
  submitLabel?: string;
}

export const SleepForm: React.FC<SleepFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  title = "Add Sleep Entry",
  submitLabel = "Save Entry",
}) => {
  // Get today's date for default value
  const today = getTodayFormattedInToronto();
  
  const form = useForm<SleepFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sleep_date: defaultValues?.sleep_date || today,
      bedtime: defaultValues?.bedtime || "22:00",
      wake_time: defaultValues?.wake_time || "06:00",
      quality_score: defaultValues?.quality_score || 75,
      routine_score: defaultValues?.routine_score || 75,
      heart_rate: defaultValues?.heart_rate || undefined,
      hrv: defaultValues?.hrv || undefined,
      breath_rate: defaultValues?.breath_rate || undefined,
      snoring_percentage: defaultValues?.snoring_percentage || undefined,
      sleep_latency_minutes: defaultValues?.sleep_latency_minutes || undefined,
    },
  });

  return (
    <Card className="w-full max-w-xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>Wake time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="quality_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Score: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>Rate your sleep quality from 0-100</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routine_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routine Score: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>How well did you stick to your sleep routine?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heart_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avg. Heart Rate (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                    <FormLabel>HRV (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="breath_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breath Rate (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                    <FormLabel>Snoring % (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                  <FormLabel>Time to Fall Asleep (mins)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0 pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
