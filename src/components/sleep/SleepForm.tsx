
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepFormData } from "@/lib/sleepTypes";
import { getTodayFormattedInToronto } from "@/lib/dateUtils";
import { SleepFormContainer } from "./SleepFormContainer";

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
        <SleepFormContainer 
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
};
