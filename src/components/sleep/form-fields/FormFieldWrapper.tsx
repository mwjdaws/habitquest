
import React, { ReactNode } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SleepFormData } from "@/lib/sleepTypes";

interface FormFieldWrapperProps {
  form: UseFormReturn<SleepFormData>;
  name: keyof SleepFormData;
  label: string;
  description?: string;
  children: (field: any) => ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  form,
  name,
  label,
  description,
  children
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {children(field)}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
