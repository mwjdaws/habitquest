
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface SleepLatencyFieldProps {
  form: UseFormReturn<SleepFormData>;
}

export const SleepLatencyField: React.FC<SleepLatencyFieldProps> = ({ form }) => {
  const handleNumericChange = (field: any, e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
  };

  return (
    <FormFieldWrapper
      form={form}
      name="sleep_latency_minutes"
      label="Time to Fall Asleep (mins)"
      description="Enter the approximate time it took you to fall asleep"
    >
      {field => (
        <Input
          type="number"
          {...field}
          value={field.value || ''}
          onChange={(e) => handleNumericChange(field, e)}
          placeholder="Enter minutes"
        />
      )}
    </FormFieldWrapper>
  );
};
