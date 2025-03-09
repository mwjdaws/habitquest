
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface QualityScoreFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const QualityScoreField: React.FC<QualityScoreFieldProps> = ({ form }) => {
  return (
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
  );
};
