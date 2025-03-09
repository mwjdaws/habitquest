
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface BreathRateFieldsProps {
  form: UseFormReturn<SleepFormData>;
}

export const BreathRateFields: React.FC<BreathRateFieldsProps> = ({ form }) => {
  return (
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
  );
};
