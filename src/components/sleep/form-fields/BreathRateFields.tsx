
import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface BreathRateFieldsProps {
  form: UseFormReturn<SleepFormData>;
}

export const BreathRateFields: React.FC<BreathRateFieldsProps> = ({ form }) => {
  const handleNumericChange = (field: any, e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormFieldWrapper
        form={form}
        name="breath_rate"
        label="Breath Rate (Optional)"
      >
        {field => (
          <Input
            type="number"
            {...field}
            value={field.value || ''}
            onChange={(e) => handleNumericChange(field, e)}
          />
        )}
      </FormFieldWrapper>

      <FormFieldWrapper
        form={form}
        name="snoring_percentage"
        label="Snoring % (Optional)"
      >
        {field => (
          <Input
            type="number"
            {...field}
            value={field.value || ''}
            onChange={(e) => handleNumericChange(field, e)}
          />
        )}
      </FormFieldWrapper>
    </div>
  );
};
