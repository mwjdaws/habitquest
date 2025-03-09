
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface RoutineScoreFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const RoutineScoreField: React.FC<RoutineScoreFieldProps> = ({ form }) => {
  return (
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
  );
};
