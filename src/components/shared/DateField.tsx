
import React from "react";
import { FormFieldComponent } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateFieldProps<T> {
  form?: UseFormReturn<T>;
  name?: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

export function DateField<T>({ 
  form, 
  name, 
  label, 
  description, 
  value, 
  onChange,
  id
}: DateFieldProps<T>) {
  // With React Hook Form
  if (form && name) {
    return (
      <FormFieldComponent
        form={form}
        name={name as any}
        label={label}
        description={description}
      >
        {field => <Input type="date" {...field} />}
      </FormFieldComponent>
    );
  }
  
  // Without React Hook Form (controlled component)
  return (
    <FormFieldComponent
      id={id || "date-field"}
      label={label}
      description={description}
    >
      <Input 
        type="date" 
        id={id || "date-field"} 
        value={value} 
        onChange={onChange} 
      />
    </FormFieldComponent>
  );
}
