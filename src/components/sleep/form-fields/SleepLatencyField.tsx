
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface SleepLatencyFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const SleepLatencyField: React.FC<SleepLatencyFieldProps> = ({ form }) => {
  return (
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
  );
};
