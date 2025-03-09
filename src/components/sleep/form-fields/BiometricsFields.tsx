
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface BiometricsFieldsProps {
  form: UseFormReturn<SleepFormData>;
}

export const BiometricsFields: React.FC<BiometricsFieldsProps> = ({ form }) => {
  return (
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
  );
};
