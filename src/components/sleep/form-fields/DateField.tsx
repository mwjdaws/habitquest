
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface DateFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const DateField: React.FC<DateFieldProps> = ({ form }) => {
  return (
    <FormFieldWrapper
      form={form}
      name="sleep_date"
      label="Date"
      description="Select the date for this sleep record"
    >
      {field => (
        <Input type="date" {...field} />
      )}
    </FormFieldWrapper>
  );
};
