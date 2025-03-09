
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface TimeFieldsProps {
  form: UseFormReturn<SleepFormData>;
}

export const TimeFields: React.FC<TimeFieldsProps> = ({ form }) => {
  return (
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
  );
};
