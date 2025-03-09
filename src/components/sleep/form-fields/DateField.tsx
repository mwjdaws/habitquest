
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface DateFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const DateField: React.FC<DateFieldProps> = ({ form }) => {
  return (
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
  );
};
