
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { FormFieldComponent } from "@/components/ui/form-field";

interface DateFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const DateField: React.FC<DateFieldProps> = ({ form }) => {
  return (
    <FormFieldComponent
      form={form}
      name="sleep_date"
      label="Date"
      description="Select the date for this sleep record"
    >
      {field => (
        <Input type="date" {...field} />
      )}
    </FormFieldComponent>
  );
};
