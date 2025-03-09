
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { DateField as SharedDateField } from "@/components/shared/DateField";

interface DateFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const DateField: React.FC<DateFieldProps> = ({ form }) => {
  return (
    <SharedDateField
      form={form}
      name="sleep_date"
      label="Date"
      description="Select the date for this sleep record"
    />
  );
};
