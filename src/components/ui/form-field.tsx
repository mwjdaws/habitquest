
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

// Props for standalone usage (without React Hook Form)
interface StandardFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  description?: string;
  error?: string;
  className?: string;
}

// Props for React Hook Form usage
interface FormHookFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label: string;
  children: (field: any) => ReactNode;
  description?: string;
  className?: string;
}

// Type guard to distinguish between the two prop types
function isFormHookField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: StandardFormFieldProps | FormHookFieldProps<TFieldValues, TName>
): props is FormHookFieldProps<TFieldValues, TName> {
  return 'form' in props && 'name' in props;
}

/**
 * FormField component that can be used either standalone or with React Hook Form
 */
export function FormFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: StandardFormFieldProps | FormHookFieldProps<TFieldValues, TName>) {
  // If using with React Hook Form
  if (isFormHookField(props)) {
    const { form, name, label, children, description, className } = props;
    
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("space-y-2", className)}>
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
  }
  
  // If using standalone
  const { id, label, children, description, error, className } = props;
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
